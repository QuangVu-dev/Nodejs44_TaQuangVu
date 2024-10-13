import { Sequelize } from "sequelize";

const sequelize = new Sequelize("node44_youtube", "root", "123456", {
   host: "localhost", // tên database
   port: "3306", //tên user
   dialect: "mysql", //password user
});

export default sequelize;
