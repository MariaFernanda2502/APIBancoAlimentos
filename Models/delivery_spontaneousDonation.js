module.exports = (DB, type) => {
    return DB.define('delivery_spontaneousDonation',
    {
        idDonativo: {
            primaryKey: true,
            foreignKey: true,
            type: type.INTEGER,
            references: {
                model: 'spontaneousDonations',
                key: 'id'
            }
        },
        idBodega: {
            primaryKey: true,
            foreignKey: true,
            type: type.INTEGER,
            references: {
                model: 'warehouses',
                key: 'id'
            }
        },
        kg_frutas_verduras: {
            type: type.INTEGER,
        },
        kg_pan: {
            type: type.INTEGER,
        },
        kg_abarrotes: {
            type: type.INTEGER,
        },
        kg_no_comestibles: {
            type: type.INTEGER,
        },
        estatus: {
            type: type.ENUM,
            values: ['Pendiente', 'Completado'],
        },
        fecha: {
            type: type.DATE,
        },
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}