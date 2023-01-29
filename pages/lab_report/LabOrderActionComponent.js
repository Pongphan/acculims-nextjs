import { React, useEffect, useState } from "react";
import { Input, Col, Row, Select, Checkbox } from "antd";
const { TextArea } = Input;

const LabOrderActionComponent = (props) => {
  const { getFormData, doctorList, orderNumber, action } = props;
  const [formCode, setFormCode] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formRerun, setFormRerun] = useState(false);
  const [formLab, setFormLab] = useState(false);
  const [formPrint, setFormPrint] = useState(false);
  const inputFormCode = (event) => {
    setFormCode(event);
  };
  const inputFormComment = (event) => {
    setFormComment(event.target.value);
  };
  const inputFormRerun = (event) => {
    setFormRerun(event.target.checked);
  };
  const inputFormLab = (event) => {
    setFormLab(event.target.checked);
  };
  const inputFormPrint = (event) => {
    formPrint(event.target.checked);
  };
  const actionFormReturn = () => {
    return getFormData(formCode, formComment, formRerun, formLab, formPrint);
  };

  useEffect(() => {
    actionFormReturn();
  }, [formCode, formComment, formRerun, formLab, formPrint]);

  return (
    <Row>
      <Col span={24}>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "30%" }}>เลขที่สั่ง : </td>
              <td>{orderNumber}</td>
            </tr>
            <tr>
              <td style={{ width: "30%" }}>รหัส : </td>
              <td>
                <Select
                  showSearch
                  onChange={inputFormCode}
                  style={{
                    width: 200,
                  }}
                  options={doctorList}
                />
              </td>
            </tr>
            <tr>
              <td style={{ width: "30%" }}>Comment : </td>
              <td>
                <TextArea
                  onChange={inputFormComment}
                  rows={4}
                  style={{
                    resize: "none",
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {action === "approve" ? (
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%" }}>ปล่อยผลบางส่วน</td>
                <td>
                  <Checkbox onChange={inputFormRerun} />
                </td>
              </tr>
              <tr>
                <td>HbA1C,MALB</td>
                <td>
                  <Checkbox onChange={inputFormLab} />
                </td>
              </tr>
              <tr>
                <td>Print</td>
                <td>
                  <Checkbox onChange={inputFormPrint} />
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </Col>
    </Row>
  );
};

export default LabOrderActionComponent;
