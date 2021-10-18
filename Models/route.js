module.exports = (DB, type) => {
    return DB.define('routes',
    {
        id: {
            primaryKey: true,
            type: type.INTEGER,
            autoIncrement: true,
        },
        idOperador: {
            foreignKey: true,
            type: type.INTEGER,
            references: {
                model: 'operators',
                key: 'id'
            }
        },
        dia: {
            type: type.ENUM,
            values: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            noEmpty: true,
        }
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}