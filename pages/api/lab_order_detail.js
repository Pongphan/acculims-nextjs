const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});

export default function handler(req, res) {
  let lab_head;
  const id = req.body.id;
  const query = `SELECT lab_head.department as department, 
  lab_head.lab_order_number as lab_order_number, 
  lab_head.hn, 
  concat(patient.pname,' ',patient.fname,' ',patient.lname) AS name, 
  FORMAT(timestampdiff(year,patient.birthday,curdate()),0) AS year, 
  FORMAT(timestampdiff(month,patient.birthday,curdate())-(timestampdiff(year,patient.birthday,curdate())*12),0) AS month, 
  if(patient.sex = 1,'ชาย','หญิง' ) AS SEX, 
  DATE_FORMAT(DATE_ADD(patient.birthday, INTERVAL 543 YEAR),'%d/%m/%Y') as birthday, 
  DATE_FORMAT(DATE_ADD(lab_head.order_date, INTERVAL 543 YEAR),'%d/%m/%Y') as order_date, 
  lab_head.order_time, 
  lab_head.form_name,
  kskdepartment.department as room, 
  pttype.name as ptname, 
  doctor.name as docname, 
  if(trim(lab_head.department) ='IPD',ward.name,kskdepartment.department) as wardname, 
  lab_head.lab_head_remark, 
  lab_head.receive_status, 
  lab_head.report_status, 

  concat(
    DATE_FORMAT(DATE_ADD(lab_head.receive_date, INTERVAL 543 YEAR),'%Y-%m-%d'), ' ',
    DATE_FORMAT(lab_head.receive_time,'%H:%i:%s'))
    AS receive_date,
  concat(
    DATE_FORMAT(DATE_ADD(lab_head.report_date, INTERVAL 543 YEAR),'%Y-%m-%d'), ' ',
    DATE_FORMAT(lab_head.report_time,'%H:%i:%s'))
    AS report_date,
  concat(
    DATE_FORMAT(DATE_ADD(lab_head.approved_date, INTERVAL 543 YEAR),'%Y-%m-%d'), ' ',
    DATE_FORMAT(lab_head.approved_time,'%H:%i:%s'))
    AS approved_date,

  lab_head.reporter_name, 
  lab_head.approver_name, 

  lab_head.order_note 
  FROM lab_head 
  LEFT JOIN patient ON lab_head.hn = patient.hn 
  LEFT JOIN kskdepartment ON lab_head.order_department = kskdepartment.depcode 
  LEFT JOIN ovst ON lab_head.vn = ovst.vn 
  LEFT JOIN pttype ON ovst.pttype = pttype.pttype 
  LEFT JOIN lab_order ON lab_head.lab_order_number = lab_order.lab_order_number 
  LEFT JOIN doctor ON lab_head.doctor_code = doctor.code 
  LEFT JOIN ward ON lab_head.ward = ward.ward 
  WHERE lab_head.lab_order_number = '${id}' 
  GROUP BY lab_head.lab_order_number`;

  let query_item = `SELECT lab_order.lab_order_number,lab_order.specimen_code,
  lab_specimen_items.specimen_name
  FROM lab_order 
  LEFT JOIN lab_specimen_items ON lab_order.specimen_code = lab_specimen_items.specimen_code 
  WHERE lab_order.lab_order_number = '${id}' 
  AND lab_order.specimen_code <> '' 
  AND lab_specimen_items.specimen_name <> '' 
  GROUP BY lab_specimen_items.specimen_name;`;

  query_item =
    query_item +
    `SELECT lab_order.lab_order_number,lab_items_sub_group.lab_items_sub_group_name as lab_profile
  FROM lab_order 
  LEFT JOIN lab_items_sub_group ON lab_order.lab_items_sub_group_code = lab_items_sub_group.lab_items_sub_group_code 
  WHERE lab_order.lab_order_number = '${id}' 
  AND lab_order.lab_items_sub_group_code <> ''
  GROUP BY lab_order.lab_items_sub_group_code ;`;

  query_item =
    query_item +
    `SELECT lab_order.lab_order_number,lab_items.lab_items_group,lab_items_group.lab_items_group_name
  FROM lab_order
  LEFT JOIN lab_items ON lab_order.lab_items_code = lab_items.lab_items_code
  LEFT JOIN lab_items_group ON lab_items.lab_items_group = lab_items_group.lab_items_group_code
  WHERE lab_order.lab_order_number = '${id}'
  AND lab_order.lab_items_code <> '' 
  GROUP BY lab_items.lab_items_group;`;

  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.error(err);
      return;
    }
    lab_head = rows;
    connection.query(query_item, function (err2, rows2, fields) {
      if (err2) {
        console.error(err2);
        return;
      }
      res.status(200).json({
        lab_head: lab_head,
        lab_order: rows2[0],
        lab_profile: rows2[1],
        lab_single: rows2[2],
      });
    });
  });
}
