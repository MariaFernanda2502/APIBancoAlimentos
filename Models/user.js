module.exports = (DB, type) => {
    return DB.define('users',
    {
        id: {
            primaryKey: true,
            type: type.INTEGER,
            autoIncrement: true,
        },
        nombre: {
            type: type.STRING,
        },
        apellidoPaterno: {
            type: type.STRING,
        },
        apellidoMaterno: {
            type: type.STRING,
        },
        correo: {
            type: type.STRING,
            validate: {
            isEmail: true
            }
        },
        telefonoCasa: {
            type: type.BIGINT,
            validate: {
                isNumeric: true,
            }
        },
        telefonoCelular: {
            type: type.BIGINT,
            validate: {
                isNumeric: true,
            }
        },
        username: {
            type: type.STRING,
        },
        contrasena: {
            type: type.STRING,
        },
        puesto: {
            type: type.ENUM,
            values: ['Administrador', 'Operador', 'Coordinador', 'Almacenista'],
        }
    }, {
        // Opción para permitir soft delete
        paranoid: true
    })
}