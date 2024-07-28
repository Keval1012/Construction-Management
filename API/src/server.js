import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
// import fs from 'fs';
import dotenv from 'dotenv';
// const session = require('express-session');
import dbConnect from './dbo.js';
// const mongodb = require('mongodb');
import user from './routes/user.js';
import project from './routes/project.js';
// import category from './routes/category.js';
import role from './routes/role.js';
import login from './routes/login.js';
import task from './routes/task.js';
import inspection from './routes/inspection.js';
import equipment from './routes/equipment.js';
import equipmentRequest from './routes/equipmentRequest.js';
import equipmentName from './routes/equipmentName.js';
import permission from './routes/permission.js';
import milestone from './routes/milestone.js';
import budget from './routes/budget.js';
import budgetCategory from './routes/budgetCategory.js';
import purchaseOrder from './routes/purchaseOrder.js';
import saleInvoice from './routes/saleInvoice.js';
import tax from './routes/tax.js';
import { initSeed } from './seeder/seed.js';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const corsOptions = {
    origin: "http://localhost:3000",
    // origin: "http://localhost:90",                                      // Deployment Url
    // credentials: true, //access-control-allow-credentials:true
    // optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);

// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/images', express.static(path.join(__dirname, 'images/task')));
// app.use('/images', express.static(path.join(__dirname, 'images/project')));
app.use('/images/project', express.static(path.join(__dirname, 'images/project')));
app.use('/images/task', express.static(path.join(__dirname, 'images/task')));
app.use('/images/inspection', express.static(path.join(__dirname, 'images/inspection')));
app.use('/images/equipmentRequest', express.static(path.join(__dirname, 'images/equipmentRequest')));


// app.use('/images/project/:id', express.static(path.join(__dirname, 'images/project')));
// app.use('/images/task/:id', express.static(path.join(__dirname, 'images/task/:id')));
// app.use('/images/project/:id', express.static(path.join(__dirname, 'images/project/:id')));
// app.use('/images/project/:id', express.static(path.join(__dirname, 'project/:id')));
// app.use('/images/inspection/:id', express.static(path.join(__dirname, 'images/inspection/:id')));
// app.use('/images/equipmentRequest/:id', express.static(path.join(__dirname, 'images/equipmentRequest/:id')));

// app.use('/images', express.static('/src/images'));

// app.use(express.static('src/images'));
// app.use('/src/images', express.static('images'));
app.set('trust proxy', 1);
app.use(express.json());

// app.use(cors());
app.use(helmet());

// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: false }));


// ----------------------- Seed Data ------------------------
initSeed();

// ----------------------- Connection to Database ------------------------

dbConnect();

// ---------------------------------------------- All Routes -------------------------------------------


app.get("/", (req, res) => {
    return res.send('Hii!');
});

app.get("/test", (req, res) => {
    return res.send(`Hii!, Done - ${req.query?.builder}`);
});

app.use('/api/login', login);
// app.use('/api/permission', permission);
app.use('/api/user', user);
app.use('/api/role', role);
app.use('/api/permission', permission);
app.use('/api/project', project);
app.use('/api/task', task);
app.use('/api/inspection', inspection);
app.use('/api/equipment', equipment);
app.use('/api/equipmentRequest', equipmentRequest);
app.use('/api/equipmentName', equipmentName);
app.use('/api/milestone', milestone);
app.use('/api/budget', budget);
app.use('/api/budgetCategory', budgetCategory);
app.use('/api/purchaseOrder', purchaseOrder);
app.use('/api/saleInvoice', saleInvoice);
app.use('/api/tax', tax);

const port = process.env.PORT || 3008;

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});