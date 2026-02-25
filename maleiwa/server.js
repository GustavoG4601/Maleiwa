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

// serve static site
app.use('/', express.static(path.join(__dirname)));
app.use('/store/uploads', express.static(UPLOADS_DIR));



app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'admin' && password === 'admin') {
    res.cookie('admin_token', 'admin_secret', { httpOnly: true, sameSite: 'Lax' });
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('admin_token', { httpOnly: true, sameSite: 'Lax' });
  res.json({ ok: true });
});

function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.admin_token;
  if (token === 'admin_secret') return next();
  return res.status(401).json({ ok: false, error: 'unauthorized' });
}

app.get('/api/check-auth', (req, res) => {
  const token = req.cookies && req.cookies.admin_token;
  if (token === 'admin_secret') return res.json({ ok: true });
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
app.post('/api/products', authMiddleware, upload.single('image'), (req, res) => {
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
    const image = req.file ? `/store/uploads/${req.file.filename}` : (body.image || '');

    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    if (!data[collection]) data[collection] = { title: collection, desc: '', products: [] };
    const products = data[collection].products || [];
    const maxId = products.reduce((m, p) => Math.max(m, Number(p.id || 0)), 0);
    const newId = maxId + 1 || products.length + 1;
    const prod = { id: newId, name, price, oldPrice, image, color, material, description, specs, sizes, colors };
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
app.put('/api/products/:collection/:id', authMiddleware, upload.single('image'), (req, res) => {
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
    const image = req.file ? `/store/uploads/${req.file.filename}` : (body.image || existing.image);

    const updated = { ...existing, name, price, oldPrice, image, color, material, description, specs, sizes, colors };

    // If collection changed, handle moving (though here we stay in same collection by route param)
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

app.listen(PORT, () => console.log('Server running on port', PORT));
