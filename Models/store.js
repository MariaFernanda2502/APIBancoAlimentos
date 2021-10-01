module.exports = (DB, type) => {
    return DB.define('store',
    {
        id: {
            primaryKey: true,
            type: type.INTEGER,
            autoIncrement: true,
        },
        determinante: {
            type: type.INTEGER,
        },
        cadena: {
            type: type.STRING,
        },
        nombre: {
            type: type.STRING,
        },
        direccion: {
            type: type.STRING,
        },
        municipio: {
            type: type.STRING,
        },
        telefono: {
            type: type.BIGINT,
            validate: {
                isNumeric: true,
            }
        },
        idAdmin: {
            foreignKey: true,
            type: type.INTEGER,
            references: {
                model: 'administrators',
                key: 'id'
            }
        },
        idRuta: {
            foreignKey: true,
            type: type.INTEGER,
            references: {
                model: 'routes',
                key: 'id'
            }
        }
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}