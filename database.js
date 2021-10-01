require('dotenv').config();
const { Sequelize } = require('sequelize');

// IMPORTANDO ESQUEMAS
const UserModel = require('./Models/user');
const AdministratorModel = require('./Models/administrator');
const CoordinatorModel = require('./Models/coordinator');
const Delivery_donationModel = require('./Models/delivery_donation');
const Delivery_spontaneousDonationModel = require('./Models/delivery_spontaneousDonation');
const DonationModel = require('./Models/donation');
const OperatorModel = require('./Models/operator');
const RouteModel = require('./Models/route');
const SpontaneousDonationModel = require('./Models/spontaneousDonation');
const StoreModel = require('./Models/store');
const WarehouseModel = require('./Models/warehouse');
const WarehousemanModel = require('./Models/warehouseman');

// INSTANCIA PARA PODER HACER EL INICIO DE SESIÓN
const DB = new Sequelize(
    process.env.DB,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        protocol: 'tcp',
        dialectOptions: {
            encrypt: true,
        } 
    }
)

DB.authenticate()
    .then(() => {
        console.log('Connection has been established successfully');
    })
    .catch((err) => {
        console.error('Unable to connect to the database', err);
    })

// CREANDO MODELOS
const User = UserModel(DB, Sequelize);
const Administrator = AdministratorModel(DB, Sequelize);
const Coordinator = CoordinatorModel(DB, Sequelize);
const Delivery_donation = Delivery_donationModel(DB, Sequelize);
const Delivery_spontaneousDonation = Delivery_spontaneousDonationModel(DB, Sequelize);
const Donation = DonationModel(DB, Sequelize);
const Operator = OperatorModel(DB, Sequelize);
const Route = RouteModel(DB, Sequelize);
const SpontaneousDonation = SpontaneousDonationModel(DB, Sequelize);
const Store = StoreModel(DB, Sequelize);
const Warehouse = WarehouseModel(DB, Sequelize);
const Warehouseman = WarehousemanModel(DB, Sequelize);

// RELACIONES
// 1 administrator(1), user(1) HERENCIA
User.hasOne(Administrator);
Administrator.belongsTo(User, { foreignKey: 'id' });

// 2 operator(1), user(1) HERENCIA
User.hasOne(Operator);
Operator.belongsTo(User, { foreignKey:'id' });

// 3 coordinator(1), user(1) HERENCIA
User.hasOne(Coordinator);
Coordinator.belongsTo(User, { foreignKey:'id' });

// 4 operator(1), user(1) HERENCIA
User.hasOne(Warehouseman);
Warehouseman.belongsTo(User, { foreignKey:'id' });

// 5 operator(1), ruta(*)
Operator.hasMany(Route);
Route.belongsTo(Operator, { foreignKey:'idOperador' });

// 6 ruta(1), store(*)
Route.hasMany(Store);
Store.belongsTo(Route, { foreignKey:'idRuta' });

// 7 administrator(1), store(*)
Administrator.hasMany(Store);
Store.belongsTo(Administrator, { foreignKey:'idAdmin' });

// 8 operator(1), donation(*)
Operator.hasMany(Donation);
Donation.belongsTo(Operator, { foreignKey:'idOperador' });

// 9 operator(1), spontaneousDonation(*)
Operator.hasMany(SpontaneousDonation);
SpontaneousDonation.belongsTo(Operator, { foreignKey:'idOperador' });

// 10 store(1), donation(*)
Store.hasMany(Donation);
Donation.belongsTo(Store, { foreignKey:'idTienda' });

// 11 store(1), spontaneousDonation(*)
Store.hasMany(SpontaneousDonation);
SpontaneousDonation.belongsTo(Store, { foreignKey:'idTienda' });

// 12 donation(1), delivery_Donation(*)
Donation.hasMany(Delivery_donation);
Delivery_donation.belongsTo(Donation, { foreignKey:'idDonativo' });

// 13 spontaneousDonation(1), delivery_spontaneousDonation(*)
SpontaneousDonation.hasMany(Delivery_spontaneousDonation);
Delivery_spontaneousDonation.belongsTo(SpontaneousDonation, { foreignKey:'idDonativo' });

// 14 warehouse(1), delivery_Donation(*)
Warehouse.hasMany(Delivery_donation);
Delivery_donation.belongsTo(Warehouse, { foreignKey:'idBodega' });

// 15 warehouse(1), delivery_spontaneousDonation(*)
Warehouse.hasMany(Delivery_spontaneousDonation);
Delivery_spontaneousDonation.belongsTo(Warehouse, { foreignKey:'idBodega' });

// 16 warehouseman(1), warehouse(1)
Warehouse.hasOne(Warehouseman);
Warehouseman.belongsTo(Warehouse, { foreignKey: 'idBodega' });

// Para hacer drop de las tablas antes del sync
// DB.sync({ force: true })
DB.sync() 
    .then(() => {console.log(`Database & tables created!`)
    })
    .catch(err => console.error(err))

module.exports = {
    User,
    Administrator,
    Coordinator,
    Delivery_donation,
    Delivery_spontaneousDonation,
    Donation,
    Operator,
    Route,
    SpontaneousDonation,
    Store,
    Warehouse,
    Warehouseman,
    DB,
} 