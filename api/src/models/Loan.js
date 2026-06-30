import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Loan extends Model {
    static associate(models) {
      Loan.belongsTo(models.Reader, {
        foreignKey: 'readerId',
        as: 'reader',
      })
      Loan.belongsTo(models.Book, {
        foreignKey: 'bookId',
        as: 'book',
      })
    }
  }

  Loan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      readerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'readers',
          key: 'id',
        },
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
      },
      loanDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('OPEN', 'RETURNED', 'LATE'),
        defaultValue: 'OPEN',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Loan',
      tableName: 'loans',
      underscored: true,
    }
  )

  return Loan
}
