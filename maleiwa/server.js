const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
// Passenger asigna el puerto mediante process.env.PORT
const PORT = process.env.PORT || 3000;

// --- Configuración de Rutas Robustas ---
// Forzamos rutas absolutas usando __dirname para evitar errores en hosting compartido
const STORE_DIR = path.join(__dirname, 'store');
const DATA_DIR = path.join(STORE_DIR, 'data');
const UPLOADS_DIR = path.join(STORE_DIR, 'uploads');

// Asegurar que existan los directorios
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// --- Helpers para Manejo de JSON Seguro ---
function safeReadJSON(filePath, defaultVal = {}) {
  try {
    if (!fs.existsSync(filePath)) return defaultVal;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || JSON.stringify(defaultVal));
  } catch (err) {
    console.error(`Error leyendo archivo JSON en ${filePath}:`, err);
    return defaultVal;
  }
}

function safeWriteJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error escribiendo archivo JSON en ${filePath}:`, err);
    return false;
  }
}

// --- Middlewares Iniciales ---
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Bloque de Seguridad: Prohibir acceso a archivos sensibles
app.use((req, res, next) => {
  const forbidden = [
    '/store/data/',
    '/package.json',
    '/package-lock.json',
    '/.git',
    '/.env',
    '/server.js',
    '/railway.json'
  ];
  const url = req.path.toLowerCase();
  if (forbidden.some(f => url.includes(f.toLowerCase()))) {
    return res.status(403).json({ ok: false, error: 'Acceso denegado' });
  }
  next();
});

// --- Inicialización de Datos (Seeding) ---
function seedFileIfMissing(filename, defaultContent) {
  const dest = path.join(DATA_DIR, filename);
  if (!fs.existsSync(dest)) {
    // Intentar copiar de la versión original en el repositorio si existe
    const seedSource = path.join(__dirname, 'store', 'data', filename);
    if (fs.existsSync(seedSource) && seedSource !== dest) {
      fs.copyFileSync(seedSource, dest);
      console.log(`[Seed] Copiado ${filename} desde repositorio.`);
    } else {
      safeWriteJSON(dest, defaultContent);
      console.log(`[Seed] Creado ${filename} con valores por defecto.`);
    }
  }
}

seedFileIfMissing('products.json', {});
seedFileIfMissing('settings.json', {
  whatsapp1: '573046601648', whatsapp2: '', whatsapp2Active: false,
  shippingFee: 0, aboutUsTitle: '¿Quiénes somos?',
  aboutUsText: 'Maleiwa es una marca de moda consciente y minimalista inspirada en la naturaleza.',
  contactEmail: 'hola@maleiwa.com', contactInstagram: '@soy.maleiwa',
  contactTiktok: '@soy.maleiwa', contactCareersUrl: '#'
});
seedFileIfMissing('linkbio.json', {
  profileName: 'Maleiwa', profileUsername: '@soy.maleiwa',
  profileBio: 'Moda consciente y minimalista inspirada en la naturaleza.',
  profileLink: 'https://instagram.com/soy.maleiwa', profileImage: 'imagen1.webp',
  socialLinks: [
    { id: 1, name: 'Instagram', url: 'https://instagram.com/soy.maleiwa', active: true },
    { id: 2, name: 'TikTok', url: 'https://www.tiktok.com/@soy.maleiwa', active: true }
  ],
  galleryTitle: 'Colección', galleryImage: 'esencia caribe.webp',
  galleryLabel: 'Esencia', catalogUrl: '#',
  whatsapp1: '', whatsapp2: '', whatsapp2Active: false
});
seedFileIfMissing('home.json', {
  heroSubtitle: 'Edición Limitada', heroTitleMain: 'Nueva Colección',
  heroTitleAccent: 'Esencia Caribe', heroDescription: 'Inspirada en la naturaleza',
  actionDescription: '"Texturas orgánicas y tonos que conectan con nuestras raíces más profundas."',
  actionButtonText: 'Explorar Colección', teaser1Text: 'Texturas', teaser2Text: 'Siluetas'
});
seedFileIfMissing('admin.json', { username: 'admin', password: 'admin', token: 'admin_secret' });
seedFileIfMissing('community.json', []);

// --- Rutas de Archivos (Paths fijas) ---
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const HOME_FILE = path.join(DATA_DIR, 'home.json');
const LINKBIO_FILE = path.join(DATA_DIR, 'linkbio.json');
const COMMUNITY_FILE = path.join(DATA_DIR, 'community.json');

// --- Auth Middleware ---
function getAdmin() {
  return safeReadJSON(ADMIN_FILE, { username: 'admin', password: 'admin', token: 'admin_secret' });
}

function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.admin_token;
  const admin = getAdmin();
  if (token && token === admin.token) return next();
  return res.status(401).json({ ok: false, error: 'unauthorized' });
}

// --- Multer para Cargas Automáticas ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// --- RUTAS DE API (Deben ir antes que express.static) ---

// Auth
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const admin = getAdmin();
  if (username === admin.username && password === admin.password) {
    res.cookie('admin_token', admin.token, { httpOnly: true, sameSite: 'Lax', secure: false }); // secure: false para http si es necesario
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('admin_token', { httpOnly: true, sameSite: 'Lax' });
  res.json({ ok: true });
});

app.get('/api/check-auth', (req, res) => {
  const token = req.cookies && req.cookies.admin_token;
  const admin = getAdmin();
  if (token && token === admin.token) return res.json({ ok: true });
  res.status(401).json({ ok: false });
});

app.post('/api/change-password', authMiddleware, (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = getAdmin();
    if (oldPassword !== admin.password) {
      return res.status(400).json({ ok: false, error: 'La contraseña actual es incorrecta' });
    }
    admin.password = newPassword;
    admin.token = 'admin_secret_' + Date.now();
    safeWriteJSON(ADMIN_FILE, admin);
    res.cookie('admin_token', admin.token, { httpOnly: true, sameSite: 'Lax' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// Products
app.get('/api/products', (req, res) => {
  const data = safeReadJSON(PRODUCTS_FILE, {});
  res.json(data);
});

app.post('/api/products', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    const body = req.body || {};
    const collection = body.collection || 'esencia';
    const data = safeReadJSON(PRODUCTS_FILE, {});

    if (!data[collection]) data[collection] = { title: collection, desc: '', products: [] };
    const products = data[collection].products || [];

    const maxId = products.reduce((m, p) => Math.max(m, Number(p.id || 0)), 0);
    const newId = maxId + 1;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `/store/uploads/${f.filename}`);
    } else if (body.image) {
      images = [body.image];
    }

    const prod = {
      id: newId,
      name: body.name || 'Sin nombre',
      price: body.price || '$0',
      oldPrice: body.oldPrice || '',
      image: images[0] || '',
      images,
      color: body.color || '',
      material: body.material || '',
      description: body.description || '',
      specs: body.specs ? (Array.isArray(body.specs) ? body.specs : String(body.specs).split('\n').map(s => s.trim()).filter(Boolean)) : [],
      sizes: body.sizes ? (Array.isArray(body.sizes) ? body.sizes : String(body.sizes).split(',').map(s => s.trim()).filter(Boolean)) : [],
      colors: body.colors ? (Array.isArray(body.colors) ? body.colors : String(body.colors).split(',').map(s => s.trim()).filter(Boolean)) : []
    };

    products.push(prod);
    data[collection].products = products;
    safeWriteJSON(PRODUCTS_FILE, data);
    res.json({ ok: true, product: prod });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.put('/api/products/:collection/:id', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    const { collection, id } = req.params;
    const body = req.body || {};
    const data = safeReadJSON(PRODUCTS_FILE, {});

    if (!data[collection] || !data[collection].products) {
      return res.status(404).json({ ok: false, error: 'Collection not found' });
    }

    const idx = data[collection].products.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return res.status(404).json({ ok: false, error: 'Product not found' });

    const existing = data[collection].products[idx];
    let images = existing.images || [existing.image];

    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `/store/uploads/${f.filename}`);
    } else if (body.images) {
      images = Array.isArray(body.images) ? body.images : [body.images];
    }

    const updated = {
      ...existing,
      name: body.name || existing.name,
      price: body.price || existing.price,
      oldPrice: body.oldPrice !== undefined ? body.oldPrice : existing.oldPrice,
      image: images[0] || '',
      images,
      color: body.color || existing.color,
      material: body.material || existing.material,
      description: body.description || existing.description,
      specs: body.specs ? (Array.isArray(body.specs) ? body.specs : String(body.specs).split('\n').map(s => s.trim()).filter(Boolean)) : existing.specs,
      sizes: body.sizes ? (Array.isArray(body.sizes) ? body.sizes : String(body.sizes).split(',').map(s => s.trim()).filter(Boolean)) : existing.sizes,
      colors: body.colors ? (Array.isArray(body.colors) ? body.colors : String(body.colors).split(',').map(s => s.trim()).filter(Boolean)) : existing.colors
    };

    data[collection].products[idx] = updated;
    safeWriteJSON(PRODUCTS_FILE, data);
    res.json({ ok: true, product: updated });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.delete('/api/products/:collection/:id', authMiddleware, (req, res) => {
  try {
    const { collection, id } = req.params;
    const data = safeReadJSON(PRODUCTS_FILE, {});
    if (!data[collection]) return res.status(404).json({ ok: false });

    const idx = data[collection].products.findIndex(p => Number(p.id) === Number(id));
    if (idx === -1) return res.status(404).json({ ok: false });

    const deleted = data[collection].products.splice(idx, 1);
    safeWriteJSON(PRODUCTS_FILE, data);
    res.json({ ok: true, product: deleted[0] });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(safeReadJSON(SETTINGS_FILE, {}));
});

app.post('/api/settings', authMiddleware, upload.fields([{ name: 'contactHeroImage', maxCount: 1 }]), (req, res) => {
  try {
    const data = safeReadJSON(SETTINGS_FILE, {});
    const body = req.body || {};

    Object.keys(body).forEach(key => {
      data[key] = key === 'whatsapp2Active' ? body[key] === 'true' : body[key];
    });

    if (req.files && req.files.contactHeroImage) {
      data.contactHeroImage = `/store/uploads/${req.files.contactHeroImage[0].filename}`;
    }

    safeWriteJSON(SETTINGS_FILE, data);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// Collections
app.post('/api/collections', authMiddleware, (req, res) => {
  const { name, title, desc } = req.body || {};
  if (!name) return res.status(400).json({ ok: false, error: 'Name required' });
  const data = safeReadJSON(PRODUCTS_FILE, {});
  if (data[name]) return res.json({ ok: false, error: 'Exists' });
  data[name] = { title: title || name, desc: desc || '', products: [] };
  safeWriteJSON(PRODUCTS_FILE, data);
  res.json({ ok: true });
});

app.delete('/api/collections/:name', authMiddleware, (req, res) => {
  const data = safeReadJSON(PRODUCTS_FILE, {});
  if (!data[req.params.name]) return res.status(404).json({ ok: false });
  delete data[req.params.name];
  safeWriteJSON(PRODUCTS_FILE, data);
  res.json({ ok: true });
});

// Home
app.get('/api/home', (req, res) => {
  res.json(safeReadJSON(HOME_FILE, {}));
});

app.post('/api/home', authMiddleware, upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'teaser1Image', maxCount: 1 },
  { name: 'teaser2Image', maxCount: 1 }
]), (req, res) => {
  try {
    const data = safeReadJSON(HOME_FILE, {});
    const body = req.body || {};
    Object.keys(body).forEach(key => data[key] = body[key]);

    if (req.files) {
      if (req.files.heroImage) data.heroImage = `/store/uploads/${req.files.heroImage[0].filename}`;
      if (req.files.teaser1Image) data.teaser1Image = `/store/uploads/${req.files.teaser1Image[0].filename}`;
      if (req.files.teaser2Image) data.teaser2Image = `/store/uploads/${req.files.teaser2Image[0].filename}`;
    }

    safeWriteJSON(HOME_FILE, data);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// Link Bio
app.get('/api/link-bio', (req, res) => {
  res.json(safeReadJSON(LINKBIO_FILE, {}));
});

app.post('/api/link-bio', authMiddleware, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'galleryImage', maxCount: 1 }
]), (req, res) => {
  try {
    const data = safeReadJSON(LINKBIO_FILE, {});
    const body = req.body || {};

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

    safeWriteJSON(LINKBIO_FILE, data);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// Community
app.get('/api/community', (req, res) => {
  const posts = safeReadJSON(COMMUNITY_FILE, []);
  res.json(posts.slice().reverse());
});

app.post('/api/community', upload.single('photo'), (req, res) => {
  try {
    const { name, message } = req.body || {};
    if (!name || !message) return res.status(400).json({ ok: false });
    const posts = safeReadJSON(COMMUNITY_FILE, []);
    const newPost = {
      id: Date.now(),
      name: name.trim().slice(0, 60),
      message: message.trim().slice(0, 500),
      photo: req.file ? `/store/uploads/${req.file.filename}` : null,
      date: new Date().toISOString()
    };
    posts.push(newPost);
    safeWriteJSON(COMMUNITY_FILE, posts);
    res.json({ ok: true, post: newPost });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.delete('/api/community/:id', authMiddleware, (req, res) => {
  try {
    const posts = safeReadJSON(COMMUNITY_FILE, []);
    const idx = posts.findIndex(p => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ ok: false });

    if (posts[idx].photo) {
      const p = path.join(__dirname, posts[idx].photo.replace(/^\//, ''));
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    posts.splice(idx, 1);
    safeWriteJSON(COMMUNITY_FILE, posts);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// --- RUTA DINÁMICA DE META TAGS (Antes de static) ---
app.get('/store/product.html', (req, res) => {
  try {
    const { collection, product: productId } = req.query;
    const fileContent = fs.readFileSync(path.join(STORE_DIR, 'product.html'), 'utf8');
    let html = fileContent;

    if (collection && productId) {
      const productsData = safeReadJSON(PRODUCTS_FILE, {});
      const coll = productsData[collection];
      if (coll && coll.products) {
        const prod = coll.products.find(p => Number(p.id) === Number(productId));
        if (prod) {
          const title = `Maleiwa | ${prod.name}`;
          const desc = prod.description || `Precio: ${prod.price} - Color: ${prod.color}. Descubre más en Maleiwa.`;
          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          const host = req.get('host');
          const imageUrl = prod.image.startsWith('http') ? prod.image : `${protocol}://${host}${prod.image}`;

          html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
          html = html.replace('Maleiwa | Producto', title);
          html = html.replace('<meta property="og:title" content="Maleiwa | Producto" />', `<meta property="og:title" content="${title}" />`);
          html = html.replace('<meta property="og:description" content="Descubre nuestra colección de moda consciente inspirada en la naturaleza." />', `<meta property="og:description" content="${desc}" />`);
          html = html.replace('<meta property="og:image" content="/store/logo.webp" />', `<meta property="og:image" content="${imageUrl}" />`);
        }
      }
    }
    res.send(html);
  } catch (e) {
    res.sendFile(path.join(STORE_DIR, 'product.html'));
  }
});

// --- SERVIDO DE ARCHIVOS ESTÁTICOS ---

// Servir la carpeta de subidas explícitamente primero
app.use('/store/uploads', express.static(UPLOADS_DIR));

// Servir el resto del sitio
app.use(express.static(__dirname));

// Manejador de 404 (para peticiones no encontradas)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada o archivo inexistente' });
});

// Error Global
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`--- Maleiwa Server (cPanel Ready) ---`);
  console.log(`Puerto: ${PORT}`);
  console.log(`Ruta Base: ${__dirname}`);
});
