module.exports = (DB, type) => {
    return DB.define('warehouse',
    {
        id: {
            primaryKey: true,
            type: type.INTEGER,
            autoIncrement: true,
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
        latitud: {
            type: type.BIGINT,
        },
        longitud: {
            type: type.BIGINT,
        },
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}