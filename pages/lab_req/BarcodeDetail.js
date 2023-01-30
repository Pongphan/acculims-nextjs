import Barcode from "react-barcode";
import { React } from "react";
import { Col, Row } from "antd";

const BarcodeDetail = (props) => {
  const { element, seperate, lab_items_name } = props;
  return !!element ? (
    <Row
      style={{
        width: 566,
        height: 189,
        margin: "auto",
        border: "1px solid #ccc",
      }}
    >
      <Col span={24} style={{ fontSize: 20 }}>
        {element["order_date_time"]} {element["patient_name"]} (
        {element["year"]} ปี {element["month"]} เดือน)
      </Col>
      <Col span={14}>
        <Barcode value={element["barcode"]} width={3} />
      </Col>
      <Col span={10} style={{ fontSize: 20, textAlign: "left" }}>
        <p style={{ margin: 0 }}>
          HN: {element["hn"]} {element["department"]}
        </p>
        <p style={{ margin: 0 }}>{element["form_name"]}</p>
        <p style={{ margin: 0, fontSize: 16 }}>
          {seperate
            ? element["lab_items_name"]
            : lab_items_name.length > 80
            ? lab_items_name.substring(0, 80) + "..."
            : lab_items_name}
        </p>
      </Col>
    </Row>
  ) : (
    <></>
  );
};

export default BarcodeDetail;
