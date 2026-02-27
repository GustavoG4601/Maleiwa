const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const DATA_DIR = path.join(__dirname, 'store', 'data');
const UPLOADS_DIR = path.join(__dirname, 'store', 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, JSON.stringify({}, null, 2));

// dynamic product meta for social sharing
app.get('/store/product.html', (req, res) => {
  try {
    const { collection, product: productId } = req.query;
    let html = fs.readFileSync(path.join(__dirname, 'store', 'product.html'), 'utf8');

    if (collection && productId) {
      const productsRaw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      const productsData = JSON.parse(productsRaw || '{}');
      const coll = productsData[collection];
      if (coll && coll.products) {
        const prod = coll.products.find(p => Number(p.id) === Number(productId));
        if (prod) {
          const title = `Maleiwa | ${prod.name}`;
          const desc = prod.description || `Precio: ${prod.price} - Color: ${prod.color}. Descubre más en Maleiwa.`;

          // Use absolute URL for the image if possible
          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          const host = req.get('host');
          const imageUrl = prod.image.startsWith('http') ? prod.image : `${protocol}://${host}${prod.image}`;

          html = html.replace('Maleiwa | Producto', title);
          html = html.replace('<meta property="og:title" content="Maleiwa | Producto" />', `<meta property="og:title" content="${title}" />`);
          html = html.replace('<meta property="og:description" content="Descubre nuestra colección de moda consciente inspirada en la naturaleza." />', `<meta property="og:description" content="${desc}" />`);
          html = html.replace('<meta property="og:image" content="/store/logo.webp" />', `<meta property="og:image" content="${imageUrl}" />`);
        }
      }
    }
    res.send(html);
  } catch (e) {
    console.error('Error serving dynamic meta:', e);
    res.sendFile(path.join(__dirname, 'store', 'product.html'));
  }
});

const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
    whatsapp: '573046601648',
    shippingFee: 0,
    aboutUsTitle: '¿Quiénes somos?',
    aboutUsText: 'Maleiwa es una marca de moda consciente y minimalista inspirada en la naturaleza.'
  }, null, 2));
}

app.get('/api/settings', (req, res) => {
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    res.json(JSON.parse(raw));
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.post('/api/settings', authMiddleware, (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// serve static site
// Block sensitive files/folders FIRST
app.use((req, res, next) => {
  const forbidden = [
    '/store/data/',
    '/package.json',
    '/package-lock.json',
    '/.git',
    '/.env',
    '/server.js'
  ];
  if (forbidden.some(f => req.path.toLowerCase().includes(f.toLowerCase()))) {
    return res.status(403).send('Acceso denegado');
  }
  next();
});

// Explicitly serve uploads first
app.use('/store/uploads', express.static(UPLOADS_DIR));

// Serve everything else
app.use('/', express.static(__dirname));



const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
if (!fs.existsSync(ADMIN_FILE)) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({
    username: 'admin',
    password: 'admin',
    token: 'admin_secret'
  }, null, 2));
}

function getAdmin() {
  const raw = fs.readFileSync(ADMIN_FILE, 'utf8');
  return JSON.parse(raw);
}

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
  res.clearCookie('admin_token', { httpOnly: true, sameSite: 'Lax' });
  res.json({ ok: true });
});

app.post('/api/change-password', authMiddleware, (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = getAdmin();
    if (oldPassword !== admin.password) {
      return res.status(400).json({ ok: false, error: 'La contraseña actual es incorrecta' });
    }
    admin.password = newPassword;
    // Generate a new token to invalidate old sessions if desired, or keep fixed
    admin.token = 'admin_secret_' + Date.now();
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2), 'utf8');

    // Set new cookie for current session
    res.cookie('admin_token', admin.token, { httpOnly: true, sameSite: 'Lax' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.admin_token;
  const admin = getAdmin();
  if (token === admin.token) return next();
  return res.status(401).json({ ok: false, error: 'unauthorized' });
}

app.get('/api/check-auth', (req, res) => {
  const token = req.cookies && req.cookies.admin_token;
  const admin = getAdmin();
  if (token === admin.token) return res.json({ ok: true });
  res.status(401).json({ ok: false });
});

// get products
app.get('/api/products', (req, res) => {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    res.json(data);
  } catch (e) {
    res.json({});
  }
});

// multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });

// add product (protected)
app.post('/api/products', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    const body = req.body || {};
    const collection = body.collection || 'esencia';
    const name = body.name || 'Sin nombre';
    const price = body.price || '$0';
    const oldPrice = body.oldPrice || '';
    const color = body.color || '';
    const material = body.material || '';
    const description = body.description || '';
    const specs = body.specs ? (Array.isArray(body.specs) ? body.specs : String(body.specs).split('\n').map(s => s.trim()).filter(Boolean)) : [];
    const sizes = body.sizes ? (Array.isArray(body.sizes) ? body.sizes : String(body.sizes).split(',').map(s => s.trim()).filter(Boolean)) : [];
    const colors = body.colors ? (Array.isArray(body.colors) ? body.colors : String(body.colors).split(',').map(s => s.trim()).filter(Boolean)) : [];

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `/store/uploads/${f.filename}`);
    } else if (body.image) {
      images = [body.image];
    } else if (body.images) {
      images = Array.isArray(body.images) ? body.images : [body.images];
    }

    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    if (!data[collection]) data[collection] = { title: collection, desc: '', products: [] };
    const products = data[collection].products || [];
    const maxId = products.reduce((m, p) => Math.max(m, Number(p.id || 0)), 0);
    const newId = maxId + 1 || products.length + 1;

    const prod = { id: newId, name, price, oldPrice, image: images[0] || '', images, color, material, description, specs, sizes, colors };
    products.push(prod);
    data[collection].products = products;
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true, product: prod });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

// update product (protected)
app.put('/api/products/:collection/:id', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    const { collection, id } = req.params;
    const productId = Number(id);
    const body = req.body || {};

    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');

    if (!data[collection] || !data[collection].products) {
      return res.status(404).json({ ok: false, error: 'Collection not found' });
    }

    const idx = data[collection].products.findIndex(p => Number(p.id) === productId);
    if (idx === -1) return res.status(404).json({ ok: false, error: 'Product not found' });

    const existing = data[collection].products[idx];

    const name = body.name || existing.name;
    const price = body.price || existing.price;
    const oldPrice = body.oldPrice !== undefined ? body.oldPrice : existing.oldPrice;
    const color = body.color || existing.color;
    const material = body.material || existing.material;
    const description = body.description || existing.description;
    const specs = body.specs ? (Array.isArray(body.specs) ? body.specs : String(body.specs).split('\n').map(s => s.trim()).filter(Boolean)) : existing.specs;
    const sizes = body.sizes ? (Array.isArray(body.sizes) ? body.sizes : String(body.sizes).split(',').map(s => s.trim()).filter(Boolean)) : existing.sizes;
    const colors = body.colors ? (Array.isArray(body.colors) ? body.colors : String(body.colors).split(',').map(s => s.trim()).filter(Boolean)) : existing.colors;

    let images = existing.images || (existing.image ? [existing.image] : []);

    // If new files uploaded, we can either append or replace. 
    // For simplicity, if new files are uploaded, we use them.
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `/store/uploads/${f.filename}`);
    } else if (body.images) {
      images = Array.isArray(body.images) ? body.images : [body.images];
    }

    const updated = { ...existing, name, price, oldPrice, image: images[0] || '', images, color, material, description, specs, sizes, colors };
    data[collection].products[idx] = updated;

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true, product: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

// delete product (protected)
app.delete('/api/products/:collection/:id', authMiddleware, (req, res) => {
  try {
    const { collection, id } = req.params;
    const productId = Number(id);

    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');

    if (!data[collection] || !data[collection].products) {
      return res.status(404).json({ ok: false, error: 'Collection not found' });
    }

    const idx = data[collection].products.findIndex(p => Number(p.id) === productId);
    if (idx === -1) {
      console.log('Product not found:', collection, productId, data[collection].products.map(p => p.id));
      return res.status(404).json({ ok: false, error: 'Product not found' });
    }

    const deletedProduct = data[collection].products[idx];
    data[collection].products.splice(idx, 1);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');

    res.json({ ok: true, product: deletedProduct });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

// create collection (protected)
app.post('/api/collections', authMiddleware, (req, res) => {
  try {
    const { name, title, desc } = req.body || {};
    if (!name) return res.status(400).json({ ok: false, error: 'Name required' });
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    if (data[name]) return res.json({ ok: false, error: 'Collection already exists' });
    data[name] = { title: title || name, desc: desc || '', products: [] };
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

// delete collection (protected)
app.delete('/api/collections/:name', authMiddleware, (req, res) => {
  try {
    const { name } = req.params;
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    if (!data[name]) return res.status(404).json({ ok: false, error: 'Not found' });
    delete data[name];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

const HOME_FILE = path.join(DATA_DIR, 'home.json');
if (!fs.existsSync(HOME_FILE)) {
  fs.writeFileSync(HOME_FILE, JSON.stringify({
    heroSubtitle: "Edición Limitada",
    heroTitleMain: "Nueva Colección",
    heroTitleAccent: "Esencia Caribe",
    heroDescription: "Inspirada en la naturaleza",
    actionDescription: "\"Texturas orgánicas y tonos que conectan con nuestras raíces más profundas.\"",
    actionButtonText: "Explorar Colección",
    teaser1Text: "Texturas",
    teaser2Text: "Siluetas"
  }, null, 2));
}

app.get('/api/home', (req, res) => {
  try {
    const raw = fs.readFileSync(HOME_FILE, 'utf8');
    res.json(JSON.parse(raw));
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.post('/api/home', authMiddleware, upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'teaser1Image', maxCount: 1 },
  { name: 'teaser2Image', maxCount: 1 }
]), (req, res) => {
  try {
    const body = req.body || {};
    const raw = fs.readFileSync(HOME_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');

    // Update text fields
    Object.keys(body).forEach(key => {
      data[key] = body[key];
    });

    // Handle uploaded files
    if (req.files) {
      if (req.files.heroImage) data.heroImage = `/store/uploads/${req.files.heroImage[0].filename}`;
      if (req.files.teaser1Image) data.teaser1Image = `/store/uploads/${req.files.teaser1Image[0].filename}`;
      if (req.files.teaser2Image) data.teaser2Image = `/store/uploads/${req.files.teaser2Image[0].filename}`;
    }

    fs.writeFileSync(HOME_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

// 404 Handler - Return JSON instead of HTML
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`--- Maleiwa Server Started ---`);
  console.log(`URL: http://localhost:${PORT}`);
});
