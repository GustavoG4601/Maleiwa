const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
// Passenger asigna el puerto mediante process.env.PORT automáticamente
const PORT = process.env.PORT || 3000;

// Configuración de rutas usando __dirname (vital en cPanel)
const STORE_DIR = path.join(__dirname, 'store');
const DATA_DIR = path.join(STORE_DIR, 'data');
const UPLOADS_DIR = path.join(STORE_DIR, 'uploads');

// Asegurar directorios base
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Ayudantes de lectura/escritura JSON robustos
const safeRead = (file, def = {}) => {
    try {
        return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8') || '{}') : def;
    } catch (e) { return def; }
};
const safeWrite = (file, data) => {
    try { fs.writeFileSync(file, JSON.stringify(data, null, 2)); return true; }
    catch (e) { return false; }
};

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Seguridad: Bloquear acceso directo a archivos sensibles
app.use((req, res, next) => {
    const forbidden = ['/store/data/', '/package.json', '/server.js', '/app.js', '/.env', '/.git'];
    if (forbidden.some(f => req.path.toLowerCase().includes(f))) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
    }
    next();
});

// Paths de archivos
const FILES = {
    products: path.join(DATA_DIR, 'products.json'),
    admin: path.join(DATA_DIR, 'admin.json'),
    settings: path.join(DATA_DIR, 'settings.json'),
    home: path.join(DATA_DIR, 'home.json'),
    linkbio: path.join(DATA_DIR, 'linkbio.json'),
    community: path.join(DATA_DIR, 'community.json')
};

// Seeding inicial (silencioso)
if (!fs.existsSync(FILES.admin)) {
    safeWrite(FILES.admin, { username: 'admin', password: 'admin', token: 'admin_secret' });
}

// Auth Middleware
const getAdmin = () => safeRead(FILES.admin, { username: 'admin', password: 'admin', token: 'admin_secret' });
const auth = (req, res, next) => {
    const token = req.cookies?.admin_token;
    if (token && token === getAdmin().token) return next();
    res.status(401).json({ ok: false, error: 'unauthorized' });
};

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- API ---

app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    const admin = getAdmin();
    if (username === admin.username && password === admin.password) {
        res.cookie('admin_token', admin.token, { httpOnly: true, sameSite: 'Lax' });
        return res.json({ ok: true });
    }
    res.status(401).json({ ok: false });
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ ok: true });
});

app.get('/api/check-auth', (req, res) => {
    const token = req.cookies?.admin_token;
    res.json({ ok: token === getAdmin().token });
});

app.post('/api/change-password', auth, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const admin = getAdmin();
    if (oldPassword !== admin.password) return res.status(400).json({ ok: false });
    admin.password = newPassword;
    admin.token = 'admin_secret_' + Date.now();
    safeWrite(FILES.admin, admin);
    res.cookie('admin_token', admin.token, { httpOnly: true });
    res.json({ ok: true });
});

// Products
app.get('/api/products', (req, res) => res.json(safeRead(FILES.products)));

app.post('/api/products', auth, upload.array('images', 5), (req, res) => {
    const body = req.body || {};
    const coll = body.collection || 'esencia';
    const data = safeRead(FILES.products);
    if (!data[coll]) data[coll] = { title: coll, desc: '', products: [] };

    const id = (data[coll].products.reduce((m, p) => Math.max(m, Number(p.id || 0)), 0)) + 1;
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
    safeWrite(FILES.products, data);
    res.json({ ok: true, product: prod });
});

app.put('/api/products/:coll/:id', auth, upload.array('images', 5), (req, res) => {
    const { coll, id } = req.params;
    const data = safeRead(FILES.products);
    if (!data[coll]) return res.status(404).json({ ok: false });
    const idx = data[coll].products.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return res.status(404).json({ ok: false });

    const existing = data[coll].products[idx];
    const images = req.files?.length ? req.files.map(f => `/store/uploads/${f.filename}`) : (req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : existing.images);

    data[coll].products[idx] = { ...existing, ...req.body, images, image: images[0] || '', id: Number(id) };
    safeWrite(FILES.products, data);
    res.json({ ok: true });
});

app.delete('/api/products/:coll/:id', auth, (req, res) => {
    const { coll, id } = req.params;
    const data = safeRead(FILES.products);
    if (!data[coll]) return res.status(404).json({ ok: false });
    data[coll].products = data[coll].products.filter(p => Number(p.id) !== Number(id));
    safeWrite(FILES.products, data);
    res.json({ ok: true });
});

// Settings & Other
app.get('/api/settings', (req, res) => res.json(safeRead(FILES.settings)));
app.post('/api/settings', auth, upload.fields([{ name: 'contactHeroImage', maxCount: 1 }]), (req, res) => {
    const data = safeRead(FILES.settings);
    Object.assign(data, req.body);
    if (req.files?.contactHeroImage) data.contactHeroImage = `/store/uploads/${req.files.contactHeroImage[0].filename}`;
    safeWrite(FILES.settings, data);
    res.json({ ok: true });
});

app.get('/api/home', (req, res) => res.json(safeRead(FILES.home)));
app.post('/api/home', auth, upload.fields([{ name: 'heroImage' }, { name: 'teaser1Image' }, { name: 'teaser2Image' }]), (req, res) => {
    const data = safeRead(FILES.home);
    Object.assign(data, req.body);
    if (req.files) {
        if (req.files.heroImage) data.heroImage = `/store/uploads/${req.files.heroImage[0].filename}`;
        if (req.files.teaser1Image) data.teaser1Image = `/store/uploads/${req.files.teaser1Image[0].filename}`;
        if (req.files.teaser2Image) data.teaser2Image = `/store/uploads/${req.files.teaser2Image[0].filename}`;
    }
    safeWrite(FILES.home, data);
    res.json({ ok: true });
});

app.get('/api/link-bio', (req, res) => res.json(safeRead(FILES.linkbio)));
app.get('/api/community', (req, res) => res.json(safeRead(FILES.community, []).slice().reverse()));
app.post('/api/community', upload.single('photo'), (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).json({ ok: false });
    const posts = safeRead(FILES.community, []);
    const post = { id: Date.now(), name, message, photo: req.file ? `/store/uploads/${req.file.filename}` : null, date: new Date().toISOString() };
    posts.push(post);
    safeWrite(FILES.community, posts);
    res.json({ ok: true, post });
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

// Estáticos
app.use('/store/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname));

// Start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
