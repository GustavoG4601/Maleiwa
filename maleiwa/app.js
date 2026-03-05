const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

const app = express();
// Passenger pasa el puerto como variable de entorno. Puede ser un número o una ruta de socket Unix.
const PORT = process.env.PORT || 3000;

// Log de inicio para depuración en cPanel
console.log('--- Iniciando Maleiwa ---');
console.log('__dirname:', __dirname);
console.log('CWD:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);

// Configuración de rutas (Rutas absolutas obligatorias en cPanel)
const STORE_DIR = path.join(__dirname, 'store');
const DATA_DIR = path.join(STORE_DIR, 'data');
const UPLOADS_DIR = path.join(STORE_DIR, 'uploads');

// --- VERIFICACIÓN DE PERMISOS AL INICIAR ---
function checkPermissions() {
    try {
        [DATA_DIR, UPLOADS_DIR].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`[Init] Creado directorio: ${dir}`);
            }
            // Intentar escribir un archivo de prueba
            const testFile = path.join(dir, '.write_test');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
        });
        console.log('[Init] Permisos de escritura verificados.');
    } catch (e) {
        console.error('[CRITICAL] Error de permisos en el servidor:', e.message);
    }
}
checkPermissions();

// Helpers JSON
const safeRead = (file, def = {}) => {
    try {
        if (!fs.existsSync(file)) return def;
        const content = fs.readFileSync(file, 'utf8');
        return JSON.parse(content || JSON.stringify(def));
    } catch (e) {
        console.error(`Error leyendo ${path.basename(file)}:`, e.message);
        return def;
    }
};

const safeWrite = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error(`Error escribiendo en ${path.basename(file)}:`, e.message);
        return false;
    }
};

// Middlewares
app.use(compression()); // Gzip: reduce el tamaño de respuestas hasta un 70%
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware para ver qué rutas están llegando realmente
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

// Caché inteligente: solo las rutas /api/ van sin caché
// Los archivos estáticos (imágenes, JS, CSS) se cachean por 7 días en el navegador
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

const FILES = {
    products: path.join(DATA_DIR, 'products.json'),
    admin: path.join(DATA_DIR, 'admin.json'),
    settings: path.join(DATA_DIR, 'settings.json'),
    home: path.join(DATA_DIR, 'home.json'),
    linkbio: path.join(DATA_DIR, 'linkbio.json'),
    community: path.join(DATA_DIR, 'community.json')
};

// Auth
const getAdmin = () => safeRead(FILES.admin, { username: 'admin', password: 'admin', token: 'admin_secret' });

const auth = (req, res, next) => {
    const token = req.cookies?.admin_token;
    const admin = getAdmin();
    if (token && token === admin.token) return next();
    console.warn(`[Auth] Intento de acceso fallido desde: ${req.ip}`);
    res.status(401).json({ ok: false, error: 'unauthorized' });
};

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- API ---

// Usamos expresiones regulares o asteriscos para que las rutas funcionen 
// incluso si la app está en una subcarpeta (ej: /maleiwa/api/login)
app.post(['/api/login', '*/api/login'], (req, res) => {
    const { username, password } = req.body || {};
    const admin = getAdmin();
    if (username === admin.username && password === admin.password) {
        // En cPanel vamos a ser menos estrictos con la rotación si la escritura falla
        const sessionToken = 'sess_' + Date.now().toString(36);
        admin.token = sessionToken;

        if (safeWrite(FILES.admin, admin)) {
            res.cookie('admin_token', sessionToken, {
                httpOnly: true,
                sameSite: 'Lax',
                path: '/',
                maxAge: 60 * 60 * 1000 // 1 hora
            });
            return res.json({ ok: true });
        } else {
            return res.status(500).json({ ok: false, error: 'No se pudo guardar la sesión en el servidor (Permisos)' });
        }
    }
    res.status(401).json({ ok: false });
});

app.post(['/api/logout', '*/api/logout'], (req, res) => {
    res.clearCookie('admin_token', { path: '/' });
    res.json({ ok: true });
});

app.get(['/api/check-auth', '*/api/check-auth'], (req, res) => {
    const token = req.cookies?.admin_token;
    const admin = getAdmin();
    if (token && token === admin.token) return res.json({ ok: true });
    res.status(401).json({ ok: false });
});

app.post(['/api/change-password', '*/api/change-password'], auth, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const admin = getAdmin();
    if (oldPassword !== admin.password) {
        return res.status(400).json({ ok: false, error: 'Contraseña actual incorrecta' });
    }
    admin.password = newPassword;
    admin.token = 'sess_' + Date.now().toString(36); // Cambiar token para forzar re-login
    if (safeWrite(FILES.admin, admin)) {
        res.cookie('admin_token', admin.token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 1000 });
        res.json({ ok: true });
    } else {
        res.status(500).json({ ok: false, error: 'Error al escribir en servidor' });
    }
});

// Products
app.get(['/api/products', '*/api/products'], (req, res) => res.json(safeRead(FILES.products)));

app.post(['/api/products', '*/api/products'], auth, upload.array('images', 5), (req, res) => {
    const body = req.body || {};
    const coll = body.collection || 'esencia';
    const data = safeRead(FILES.products);
    if (!data[coll]) data[coll] = { title: coll, desc: '', products: [] };

    const id = Date.now(); // ID basado en tiempo para evitar duplicados
    const images = req.files?.length ? req.files.map(f => `/store/uploads/${f.filename}`) : (body.image ? [body.image] : []);

    const prod = {
        id, name: body.name || 'Nuevo', price: body.price || '$0', oldPrice: body.oldPrice || '',
        image: images[0] || '', images, color: body.color || '', material: body.material || '',
        description: body.description || '',
        specs: body.specs ? (Array.isArray(body.specs) ? body.specs : String(body.specs).split('\n').filter(Boolean)) : [],
        sizes: body.sizes ? (Array.isArray(body.sizes) ? body.sizes : String(body.sizes).split(',').filter(Boolean)) : [],
        colors: body.colors ? (Array.isArray(body.colors) ? body.colors : String(body.colors).split(',').filter(Boolean)) : []
    };
    data[coll].products.push(prod);
    if (safeWrite(FILES.products, data)) {
        res.json({ ok: true, product: prod });
    } else {
        res.status(500).json({ ok: false, error: 'Error al escribir archivo de productos' });
    }
});

app.put(['/api/products/:coll/:id', '*/api/products/:coll/:id'], auth, upload.array('images', 5), (req, res) => {
    const { coll, id } = req.params;
    const data = safeRead(FILES.products);
    if (!data[coll]) return res.status(404).json({ ok: false });
    const idx = data[coll].products.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return res.status(404).json({ ok: false });

    const existing = data[coll].products[idx];
    const images = req.files?.length ? req.files.map(f => `/store/uploads/${f.filename}`) : (req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : existing.images);

    data[coll].products[idx] = { ...existing, ...req.body, images, image: images[0] || '', id: Number(id) };
    if (safeWrite(FILES.products, data)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

app.delete(['/api/products/:coll/:id', '*/api/products/:coll/:id'], auth, (req, res) => {
    const { coll, id } = req.params;
    const data = safeRead(FILES.products);
    if (!data[coll]) return res.status(404).json({ ok: false });
    data[coll].products = data[coll].products.filter(p => Number(p.id) !== Number(id));
    if (safeWrite(FILES.products, data)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

// Collections
app.post(['/api/collections', '*/api/collections'], auth, (req, res) => {
    const { name, title, desc } = req.body || {};
    if (!name) return res.status(400).json({ ok: false, error: 'ID requerido' });
    const data = safeRead(FILES.products);
    if (data[name]) return res.json({ ok: false, error: 'La colección ya existe' });
    data[name] = { title: title || name, desc: desc || '', products: [] };
    if (safeWrite(FILES.products, data)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

app.delete(['/api/collections/:name', '*/api/collections/:name'], auth, (req, res) => {
    const { name } = req.params;
    const data = safeRead(FILES.products);
    if (!data[name]) return res.status(404).json({ ok: false });
    delete data[name];
    if (safeWrite(FILES.products, data)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

// Settings & Other
app.get(['/api/settings', '*/api/settings'], (req, res) => res.json(safeRead(FILES.settings)));
app.post(['/api/settings', '*/api/settings'], auth, upload.fields([{ name: 'contactHeroImage', maxCount: 1 }]), (req, res) => {
    const data = safeRead(FILES.settings);
    Object.assign(data, req.body);
    if (req.files?.contactHeroImage) data.contactHeroImage = `/store/uploads/${req.files.contactHeroImage[0].filename}`;
    if (safeWrite(FILES.settings, data)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

app.get(['/api/home', '*/api/home'], (req, res) => res.json(safeRead(FILES.home)));
app.post(['/api/home', '*/api/home'], auth, upload.fields([{ name: 'heroImage' }, { name: 'teaser1Image' }, { name: 'teaser2Image' }]), (req, res) => {
    const data = safeRead(FILES.home);
    Object.assign(data, req.body);
    if (req.files) {
        if (req.files.heroImage) data.heroImage = `/store/uploads/${req.files.heroImage[0].filename}`;
        if (req.files.teaser1Image) data.teaser1Image = `/store/uploads/${req.files.teaser1Image[0].filename}`;
        if (req.files.teaser2Image) data.teaser2Image = `/store/uploads/${req.files.teaser2Image[0].filename}`;
    }
    if (safeWrite(FILES.home, data)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

app.get(['/api/link-bio', '*/api/link-bio'], (req, res) => res.json(safeRead(FILES.linkbio)));
app.post(['/api/link-bio', '*/api/link-bio'], auth, upload.fields([{ name: 'profileImage' }, { name: 'galleryImage' }]), (req, res) => {
    const data = safeRead(FILES.linkbio);
    const body = req.body || {};

    // Actualizar campos de texto
    Object.keys(body).forEach(key => {
        if (key === 'socialLinks' && typeof body[key] === 'string') {
            try { data[key] = JSON.parse(body[key]); } catch (e) { }
        } else if (key === 'whatsapp2Active') {
            data[key] = body[key] === 'true';
        } else {
            data[key] = body[key];
        }
    });

    if (req.files) {
        if (req.files.profileImage) data.profileImage = `/store/uploads/${req.files.profileImage[0].filename}`;
        if (req.files.galleryImage) data.galleryImage = `/store/uploads/${req.files.galleryImage[0].filename}`;
    }
    if (safeWrite(FILES.linkbio, data)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

app.get(['/api/community', '*/api/community'], (req, res) => res.json(safeRead(FILES.community, []).slice().reverse()));
app.post(['/api/community', '*/api/community'], upload.single('photo'), (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).json({ ok: false });
    const posts = safeRead(FILES.community, []);
    const post = { id: Date.now(), name, message, photo: req.file ? `/store/uploads/${req.file.filename}` : null, date: new Date().toISOString() };
    posts.push(post);
    if (safeWrite(FILES.community, posts)) res.json({ ok: true, post });
    else res.status(500).json({ ok: false });
});

app.delete(['/api/community/:id', '*/api/community/:id'], auth, (req, res) => {
    const posts = safeRead(FILES.community, []);
    const newPosts = posts.filter(p => Number(p.id) !== Number(req.params.id));
    if (safeWrite(FILES.community, newPosts)) res.json({ ok: true });
    else res.status(500).json({ ok: false });
});

// Meta tags dinámicos
app.get('/store/product.html', (req, res) => {
    try {
        const { collection, product } = req.query;
        let html = fs.readFileSync(path.join(STORE_DIR, 'product.html'), 'utf8');
        if (collection && product) {
            const data = safeRead(FILES.products);
            const p = data[collection]?.products.find(x => Number(x.id) === Number(product));
            if (p) {
                const title = `Maleiwa | ${p.name}`;
                const image = p.image.startsWith('http') ? p.image : `${req.protocol}://${req.get('host')}${p.image}`;
                html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
                    .replace(/property="og:title" content=".*?"/g, `property="og:title" content="${title}"`)
                    .replace(/property="og:image" content=".*?"/g, `property="og:image" content="${image}"`);
            }
        }
        res.send(html);
    } catch (e) { res.sendFile(path.join(STORE_DIR, 'product.html')); }
});

// Archivos subidos (imágenes): caché de 7 días en el navegador
app.use('/store/uploads', express.static(UPLOADS_DIR, {
    maxAge: '7d',
    immutable: true
}));

// Archivos estáticos del sitio: caché de 1 día
app.use(express.static(__dirname, {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));

// Start - compatible con Phusion Passenger (cPanel) y ejecución directa
// Passenger puede pasar un socket Unix como PORT (ej: /tmp/passenger.xxx.sock)
const startServer = () => {
    app.listen(PORT, () => {
        const addr = typeof PORT === 'string' && PORT.startsWith('/')
            ? `socket ${PORT}`
            : `http://localhost:${PORT}`;
        console.log(`--- Server Maleiwa iniciado en ${addr} ---`);
    }).on('error', (err) => {
        console.error('Error al iniciar servidor:', err.message);
        process.exit(1);
    });
};

// Exportar para Passenger (modo alternativo de arranque)
module.exports = app;

startServer();
