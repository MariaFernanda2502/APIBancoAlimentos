module.exports = (DB, type) => {
    return DB.define('coordinator',
    {
        id: {
            foreignKey: true,
            primaryKey: true,
            type: type.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}