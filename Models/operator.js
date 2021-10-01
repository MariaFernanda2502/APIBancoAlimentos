module.exports = (DB, type) => {
    return DB.define('operator',
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
            type: type.BIGINT,
        },
        longitud: {
            type: type.BIGINT,
        },
        vencimiento_licencia: {
            type: type.DATE,
        }
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}