module.exports = (DB, type) => {
    return DB.define('operators',
    {
        id: {
            foreignKey: true,
            primaryKey: true,
            type: type.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        placaVehiculo: {
            type: type.STRING,
        },
        latitud: {
            type: type.FLOAT,
        },
        longitud: {
            type: type.FLOAT,
        },
        vencimiento_licencia: {
            type: type.DATE,
        }
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}