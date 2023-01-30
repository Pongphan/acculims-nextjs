import { React, useState, useEffect } from "react";
import {
  Row,
  Col,
  Checkbox,
  Divider,
  Input,
  Form,
  TimePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
const { TextArea } = Input;
const CancelComponent = (props_reject) => {
  const [data, setData] = useState(props_reject.data);
  const [reasonCheck, setReasonCheck] = useState(null);
  const [reasonOther, setReasonOther] = useState(null);
  const [solution, setSolution] = useState(null);
  const [time, setTime] = useState(null);
  const [approver, setApprover] = useState(null);
  const [approved, setApproved] = useState(null);
  const inputReasonOther = (event) => {
    setReasonOther(event.target.value);
  };

  const onChangeReason = (checkedValues) => {
    setReasonCheck(checkedValues);
  };
  const onChangeSolve = (checkedValues) => {
    setSolution(checkedValues.target.value);
  };
  const onChangeTime = (checkedValues) => {
    setTime(dayjs(checkedValues).format("HH:mm"));
  };
  const onChangeApprover = (checkedValues) => {
    setApprover(checkedValues);
  };
  const onChangeApproved = (checkedValues) => {
    setApproved(checkedValues);
  };

  useEffect(() => {
    const sendData = () => {
      props_reject.rejectForm({
        reasonCheck: reasonCheck,
        reasonOther: reasonOther,
        solution: solution,
        time: time,
        approver: approver,
        approved: approved,
      });
    };
    sendData();
    setData(props_reject.data);
  }, [
    reasonCheck,
    reasonOther,
    time,
    approver,
    approved,
    solution,
    props_reject,
  ]);
  return !!data ? (
    <>
      <Row>
        <Col span={12}>
          <b>เลขที่สั่ง :</b> {data["lab_order_number"]}
        </Col>
        <Col span={12}>
          <b>LAB :</b> {data["form_name"]}
        </Col>
        <Col span={12}>
          <b>HN :</b> {data["hn"]}
        </Col>
        <Col span={12}>
          <b>ชื่อ-สกุล :</b> {data["name"]}
        </Col>
      </Row>
      <Divider orientation="left">แบบฟอร์มยืนยันปฎิเสธสิ่งส่งตรวจ</Divider>

      <Form layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item label="แนวทางการแก้ปัญหา">
              <Checkbox.Group
                style={{
                  width: "100%",
                }}
                onChange={onChangeReason}
              >
                <Row
                  style={{
                    width: "100%",
                  }}
                >
                  <Col span={12}>
                    <Checkbox value="1">ไม่มีรายการตรวจทาง LAN</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="2">Hemolysis</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="3">
                      เจาะเลือดไม่ถูกชนิดกับรายการตรวจ
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="4">เลือด Clotted (CBC,FBS)</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="5">ชื่อในใบกับหลอดเลือดไม่ตรงกัน</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="6">ไม่มีใบนำส่ง</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="7">ปิดฝาหลอดเลือดสลับกัน</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="8">ไม่มี Sample</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="9">ไม่มีฉลากติด</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="10">ส่ง LAN ผิด</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="11">ปริมาณ Sample ไม่ถูกต้อง</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Input
                      placeholder="อื่นๆ ระบุ"
                      onChange={inputReasonOther}
                      value={reasonOther}
                    />
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="แนวทางการแก้ปัญหา">
              <TextArea
                onChange={onChangeSolve}
                rows={4}
                style={{
                  resize: "none",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="เวลาแจ้ง">
              <TimePicker
                onChange={onChangeTime}
                format="HH:mm"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ผู้ตวจสอบ/ผู้แจ้ง">
              <Select
                onChange={onChangeApprover}
                showSearch
                style={{ width: 200 }}
                options={props_reject.doctorList}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ผู้รับแจ้ง">
              <Select
                onChange={onChangeApproved}
                showSearch
                style={{ width: 200 }}
                options={props_reject.doctorList}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  ) : (
    <></>
  );
};

export default CancelComponent;
