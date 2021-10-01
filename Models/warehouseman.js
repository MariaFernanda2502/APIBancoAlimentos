module.exports = (DB, type) => {
    return DB.define('warehouseman',
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
        idBodega: {
            foreignKey: true,
            type: type.INTEGER,
            references: {
                model: 'warehouses',
                key: 'id'
            }
        },
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}