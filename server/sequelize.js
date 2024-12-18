import Sequelize from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database_project.db",
    define: {
        timestamps: false
    }
});

export const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "client"
    }
});

// Product Model
export const Product = sequelize.define('Product', {
    productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    desc: {
        type: Sequelize.STRING,
    },
    stock: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.FLOAT,
    },
    images: {
        type: Sequelize.JSON,
        allowNull: true
    },
});

// Cart Model
export const Cart = sequelize.define('Cart', {
    cartId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
});

// CartRow Model
export const CartRow = sequelize.define('CartRow', {
    cartRowId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cartId: {
        type: Sequelize.INTEGER
    },
    productId: {
        type: Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.FLOAT
    }
});

Cart.hasMany(CartRow, { foreignKey: 'cartId' });
CartRow.belongsTo(Cart, { foreignKey: 'cartId' });

Product.hasMany(CartRow, { foreignKey: 'productId' });
CartRow.belongsTo(Product, { foreignKey: 'productId' });

Cart.belongsToMany(Product, { through: 'CartRow', foreignKey: 'cartId', onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: 'CartRow', foreignKey: 'productId', onDelete: 'CASCADE' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

sequelize.authenticate()
    .then(() => {
        console.log("Connected!")
    })
    .catch(err => console.log("Error connecting: " + err));

sequelize
    .sync({ force: false, alter: false })
    .then(() => { console.log("Database synced"); })
    .catch(err => console.log("Error syncing database:" + err));