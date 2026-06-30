import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Reader extends Model {
    static associate(models) {
      Reader.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      })
      Reader.hasMany(models.Loan, {
        foreignKey: 'readerId',
        as: 'loans',
      })
    }
  }

  Reader.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      documentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Reader',
      tableName: 'readers',
      underscored: true,
    }
  )

  return Reader
}
