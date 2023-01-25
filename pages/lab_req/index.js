import { React, useEffect, useState, useRef } from "react";
import thTH from "antd/locale/th_TH";
import {
  ConfigProvider,
  Card,
  Table,
  Layout,
  Col,
  Row,
  Button,
  Radio,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Spin,
  message,
  Modal,
  Empty,
} from "antd";
import StickyBox from "react-sticky-box";
import {
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import ReactToPrint from "react-to-print";
//import "./LabReq.css";
import DetailComponent from "./DetailComponent";
import DetailNoteComponent from "./DetailNoteComponent";
import DetailThingComponent from "./DetailThingComponent";
import BarcodeComponent from "./BarcodeComponent";
import CancelComponent from "./CancelComponent";

const API_server = "http://localhost:3000";
const API_post_list = API_server + "/api/lab_order";
const API_post_detail = API_server + "/api/lab_order_detail";

const API_post_barcode = API_server + "/api/lab_barcode";
const API_get_lab_form_head = API_server + "/api/get_lab_form_head";
const API_get_lab_items_group = API_server + "/api/get_lab_items_group";
const API_get_doctor = API_server + "/api/get_doctor";

const API_post_action = API_server + "/api/lab_order_action_event";
const API_post_cancel_reason = API_server + "/api/lab_order_reject";
const API_post_note = API_server + "/api/lab_order_note";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const currDate = dayjs();
const beforeDate = currDate.subtract(4, "month");

function LabReq() {
  const componentRef = useRef();
  const [refreshKey, setRefreshKey] = useState(0);
  let dataRejectReason = [];
  const onAddRejectForm = (newItem) => {
    dataRejectReason = newItem;
  };
  const [messageApi, messageContext] = message.useMessage();
  const closeModal = () => {
    Modal.destroyAll();
  };

  const [doctorList, setDoctorlist] = useState([]);
  const getDoctor = (action) => {
    return axios.post(API_get_doctor).then(function (response) {
      setDoctorlist(response.data);
      return axios
        .post(API_post_detail, {
          id: selectedRowKeys.join(),
        })
        .then(function (response) {
          Modal.confirm({
            centered: true,
            width: 700,
            title: "ยืนยันปฎิเสธสิ่งส่งตรวจ",
            content: (
              <CancelComponent
                data={response.data.lab_head[0]}
                rejectForm={onAddRejectForm}
                doctorList={doctorList}
              />
            ),
            onOk() {
              return axios
                .post(API_post_cancel_reason, {
                  id: selectedRowKeys.join(),
                  form: dataRejectReason,
                })
                .then(function (response) {
                  console.log(response.data);
                  actionControl(action);
                });
            },
          });
        });
    });
  };
  const showConfirmDelete = (action) => {
    getDoctor(action);
  };
  let acceptPrintBarcode = false;
  const changeAcceptPrintBarcode = (event) => {
    acceptPrintBarcode = event.target.checked;
  };
  const showConfirm = (action) => {
    Modal.confirm({
      centered: true,
      title: action === "accept" ? "ยืนยันรับใบ LAB?" : "ยืนยันลบใบ LAB?",
      content: (
        <Row>
          <Col span={24}>เลขที่สั่ง : {selectedRowKeys.join()}</Col>
          <Col span={24}>
            {action === "accept" ? (
              <Checkbox onClick={changeAcceptPrintBarcode}>
                พิมพ์ Barcode
              </Checkbox>
            ) : null}
          </Col>
        </Row>
      ),
      onOk() {
        actionControl(action);
      },
    });
  };
  const showPrint = () => {
    return axios
      .post(API_post_barcode, {
        id: selectedRowKeys,
      })
      .then(function (response) {
        Modal.info({
          centered: true,
          width: 730,
          title: "พิมพ์ Barcode",
          icon: <PrinterOutlined />,
          content: (
            <div ref={componentRef}>
              <BarcodeComponent data={response.data.result} />
            </div>
          ),
          footer: (
            <div className="ant-modal-footer">
              <ReactToPrint
                trigger={() => {
                  return <Button key="back">พิมพ์</Button>;
                }}
                content={() => componentRef.current}
              />
              <Button key="submit" type="primary" onClick={closeModal}>
                ตกลง
              </Button>
            </div>
          ),
        });
      });
  };
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState([]);
  const [statusList, setStatusList] = useState("All");
  const [dataCount, setDataCount] = useState({
    All: 0,
    Pending: 0,
    Received: 0,
    Reject: 0,
  });
  const [detail, setDetail] = useState(
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
  const [detailNote, setDetailNote] = useState(
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
  const [detailThing, setDetailThing] = useState(
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );

  const [sStartDate, setSStartDate] = useState(beforeDate.format(dateFormat));
  const [sEndDate, setSEndDate] = useState(currDate.format(dateFormat));
  const [sType, setSType] = useState(1);
  const [sInput, setSInput] = useState(null);
  const [sWork, setSWork] = useState(1);
  const [sWorkType, setSWorkType] = useState("All");
  const [sWorkTypeList, setSWorkTypeList] = useState([]);
  const [sDepart, setSDepart] = useState("ALL");
  const [sAddress, setSAddress] = useState(null);

  const [seperateTupe, setSeperateTupe] = useState(false);

  const getWorkTypeList = (id) => {
    if (id === 2) {
      return axios.get(API_get_lab_form_head).then(function (response) {
        setSWorkTypeList((oldArray) => [
          { label: "All", value: "All" },
          ...response.data,
        ]);
      });
    } else if (id === 1) {
      return axios.get(API_get_lab_items_group).then(function (response) {
        setSWorkTypeList((oldArray) => [
          { label: "All", value: "All" },
          ...response.data,
        ]);
      });
    }
  };

  const summitNote = (id, note) => {
    setLoading(true);
    return axios
      .post(API_post_note, {
        id: id,
        note: note,
      })
      .then(function (response) {
        setLoading(false);
      });
  };

  const showDetail = (data) => {
    setDetail(<DetailComponent data={data.lab_head[0]} />);
    setDetailNote(
      <DetailNoteComponent
        data={data.lab_head[0]}
        api={API_post_note}
        summitNote={summitNote}
      />
    );
    setDetailThing(<DetailThingComponent data={data.lab_order} />);
    setLoadingData(false);
  };

  const setStatusListonClick = (id) => {
    setStatusList(id);
  };

  const inputSType = (event) => {
    setSType(event.target.value);
  };
  const inputSInput = (event) => {
    setSInput(event.target.value);
  };
  const inputSDateRange = (event) => {
    setSStartDate(dayjs(event[0]).format(dateFormat));
    setSEndDate(dayjs(event[1]).format(dateFormat));
  };
  const inputSWork = (event) => {
    setSWorkType("All");
    setSWork(event.target.value);
    getWorkTypeList(event.target.value);
  };
  const inputSWorkType = (value) => {
    setSWorkType(value);
  };
  const inputSDepart = (event) => {
    setSDepart(event.target.value);
  };
  const inputSAddress = (event) => {
    setSAddress(event.target.value);
  };

  const clickSeperateTupe = (event) => {
    setSeperateTupe(event.target.checked);
  };

  useEffect(() => {
    const loadData = async () => {
      setDetail(<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />);
      setDetailNote(<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />);
      setDetailThing(<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />);
      setLoading(true);

      setSelectedRowKeys([]);

      const filter = {
        date_start: sStartDate,
        date_stop: sEndDate,
        time_start: dayjs(sStartDate).format("HH:mm:ss"),
        time_stop: dayjs(sEndDate).format("HH:mm:ss"),
        department: sDepart,
        address: sAddress,
        type: sType,
        text: sInput,
        form_name: sWorkType,
      };
      return axios.post(API_post_list, filter).then(function (response) {
        let dataArray = response.data;
        let count = {
          All: 0,
          Pending: 0,
          Received: 0,
          Reject: 0,
        };
        dataArray.forEach((d) => {
          if (d["h_status"] === "Pending") {
            count["Pending"] += 1;
          } else if (d["h_status"] === "Received") {
            count["Received"] += 1;
          } else if (d["h_status"] === "Reject") {
            count["Reject"] += 1;
          }
          count["All"] += 1;
        });
        setDataCount(count);
        setData(dataArray);
        setLoading(false);
      });
    };
    getWorkTypeList(sWork);
    loadData();
  }, [
    refreshKey,
    sStartDate,
    sEndDate,
    sType,
    sInput,
    sWorkType,
    sDepart,
    sAddress,
  ]);

  const actionControl = async (action) => {
    if (action === "print") {
      showPrint();
      setSelectedRowKeys([]);
    } else {
      return axios
        .post(API_post_action, {
          id: selectedRowKeys,
          action: action,
        })
        .then(function (response) {
          messageApi.open({
            type: response.data.result === true ? "success" : "error",
            content: response.data.alert,
          });

          if (acceptPrintBarcode) {
            showPrint();
          }
          setSelectedRowKeys([]);
          setRefreshKey((oldKey) => oldKey + 1);
          acceptPrintBarcode = false;
        });
    }
  };

  const loadDetail = async (dataDetail) => {
    setLoadingData(true);
    return axios
      .post(API_post_detail, {
        id: dataDetail.order_number,
      })
      .then(function (response) {
        showDetail(response.data);
      });
  };

  const columns = [
    {
      title: "เลขที่สั่ง",
      dataIndex: "order_number",
      key: "order_number",
      sorter: {
        compare: (a, b) => a.order_number - b.order_number,
        multiple: 1,
      },
    },
    {
      title: "Status",
      dataIndex: "h_status",
      key: "h_status",
    },
    {
      title: "HN",
      dataIndex: "HN",
      key: "HN",
    },
    {
      title: "ชื่อผู้ป่วย",
      dataIndex: "patient_name",
      key: "patient_name",
    },
    {
      title: "ชื่อใบสั่ง",
      dataIndex: "form_name",
      key: "form_name",
    },
    {
      title: "ความเร่งด่วน",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "วันเวลาที่สั่ง",
      dataIndex: "order_date_time",
      key: "order_date_time",
    },
    {
      title: "วันเวลาที่รับ",
      dataIndex: "time_receive_report",
      key: "time_receive_report",
    },
    {
      title: "ห้องที่ส่งตรวจ",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "ที่อยู่",
      dataIndex: "address",
      key: "address",
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const clickSelectRow = (newSelectedRow) => {
    if (selectedRowKeys.includes(newSelectedRow)) {
      let newSelectedRowKeys = selectedRowKeys.filter((key) => {
        if (newSelectedRow !== key) {
          return key;
        } else {
          return false;
        }
      });
      setSelectedRowKeys(newSelectedRowKeys);
    } else {
      setSelectedRowKeys([...selectedRowKeys, newSelectedRow]);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };
  const rangePresets = [
    {
      label: "ก่อนหน้านี้ 7 วัน",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 14 วัน",
      value: [dayjs().add(-14, "d"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 30 วัน",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 3 เดือน",
      value: [dayjs().subtract(3, "month"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 6 เดือน",
      value: [dayjs().subtract(6, "month"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 1 ปี",
      value: [dayjs().subtract(12, "month"), dayjs()],
    },
  ];
  return (
    <ConfigProvider locale={thTH}>
      {messageContext}
      <Layout style={{ background: "white" }}>
        <Content>
          <Row>
            <Col xs={24} lg={18}>
              <Content>
                <Row>
                  <Col xs={24} lg={4} className="iconMenu">
                    <h1>ใบรับ LAB</h1>
                  </Col>
                  <Col xs={24} lg={20}>
                    <Card>
                      <Row gutter={24}>
                        <Col span={10}>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <RangePicker
                              block
                              presets={rangePresets}
                              value={[
                                dayjs(sStartDate, dateFormat),
                                dayjs(sEndDate, dateFormat),
                              ]}
                              format={dateFormat}
                              onChange={inputSDateRange}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Radio.Group onChange={inputSType} value={sType}>
                              <Radio value={1}>Barcode</Radio>
                              <Radio value={2}>HN</Radio>
                              <Radio value={3}>ชื่อ-สกุล</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col flex="auto">
                          <Form.Item
                            style={{ marginBottom: 5, marginTop: 5 }}
                            label=":"
                          >
                            <Input onChange={inputSInput} value={sInput} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Radio.Group onChange={inputSWork} value={sWork}>
                              <Radio value={1}>งาน</Radio>
                              <Radio value={2}>Lab form</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Select
                              showSearch
                              onChange={inputSWorkType}
                              value={sWorkType}
                              style={{
                                width: 200,
                              }}
                              options={sWorkTypeList}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Radio.Group
                              onChange={inputSDepart}
                              value={sDepart}
                            >
                              <Radio value={"ALL"}>ALL</Radio>
                              <Radio value={"OPD"}>OPD</Radio>
                              <Radio value={"IPD"}>IPD</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col flex="auto">
                          <Form.Item
                            style={{ marginBottom: 5, marginTop: 5 }}
                            label="ที่อยู่ :"
                          >
                            <Input onChange={inputSAddress} value={sAddress} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <Row>
                      <Col span={6}>
                        <Button
                          onClick={() => setStatusListonClick("All")}
                          type={statusList === "All" ? "primary" : "default"}
                          block
                        >
                          All({dataCount["All"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button
                          onClick={() => setStatusListonClick("Pending")}
                          type={
                            statusList === "Pending" ? "primary" : "default"
                          }
                          block
                        >
                          Pending({dataCount["Pending"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button
                          onClick={() => setStatusListonClick("Received")}
                          type={
                            statusList === "Received" ? "primary" : "default"
                          }
                          block
                        >
                          Received({dataCount["Received"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button
                          onClick={() => setStatusListonClick("Reject")}
                          type={statusList === "Reject" ? "primary" : "default"}
                          block
                        >
                          Reject({dataCount["Reject"].toLocaleString()})
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Checkbox
                      style={{ padding: 5, paddingLeft: 20 }}
                      onChange={clickSeperateTupe}
                    >
                      Separate Tupe (FBS)
                    </Checkbox>
                  </Col>
                </Row>
              </Content>
              <Content>
                <Spin spinning={loading} tip="กำลังโหลดข้อมูล" size="large">
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data.filter((d) => {
                      if (statusList === "All") {
                        return d;
                      } else if (statusList === d["h_status"]) {
                        return d;
                      }
                      return false;
                    })}
                    rowKey={"order_number"}
                    size="small"
                    scroll={{
                      x: 1300,
                    }}
                    sticky
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          loadDetail(record);
                          clickSelectRow(record.order_number);
                        }, // click row
                      };
                    }}
                  />
                </Spin>
              </Content>
              <Row>
                <Col span={24}>
                  <Card>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex" }}>
                        <div style={{ padding: 5 }}>
                          <Button
                            style={{
                              padding: 10,
                              cursor: "pointer",
                              height: "auto",
                              minWidth: 100,
                            }}
                            onClick={() => {
                              showConfirm("accept");
                            }}
                            disabled={selectedRowKeys.length > 0 ? false : true}
                          >
                            <div>
                              <CheckCircleOutlined
                                style={{
                                  fontSize: 40,
                                }}
                              />
                            </div>
                            <div>รับใบ LAB</div>
                          </Button>
                        </div>
                        <div style={{ padding: 5 }}>
                          <Button
                            style={{
                              padding: 10,
                              cursor: "pointer",
                              height: "auto",
                              minWidth: 100,
                            }}
                            onClick={() => {
                              showConfirmDelete("reject");
                            }}
                            disabled={
                              selectedRowKeys.length === 1 ? false : true
                            }
                          >
                            <div>
                              <StopOutlined
                                style={{
                                  fontSize: 40,
                                }}
                              />
                            </div>
                            <div>ปฎิเสธ</div>
                          </Button>
                        </div>
                        <div style={{ padding: 5 }}>
                          <Button
                            danger
                            style={{
                              padding: 10,
                              cursor: "pointer",
                              height: "auto",
                              minWidth: 100,
                            }}
                            onClick={() => {
                              showConfirm("delete");
                            }}
                            disabled={selectedRowKeys.length > 0 ? false : true}
                          >
                            <div>
                              <DeleteOutlined
                                style={{
                                  fontSize: 40,
                                }}
                              />
                            </div>
                            <div>ลบ</div>
                          </Button>
                        </div>
                        <div style={{ padding: 5 }}>
                          <Button
                            style={{
                              padding: 10,
                              cursor: "pointer",
                              height: "auto",
                              minWidth: 100,
                            }}
                            onClick={() => {
                              actionControl("print");
                            }}
                            disabled={selectedRowKeys.length > 0 ? false : true}
                          >
                            <div>
                              <PrinterOutlined
                                style={{
                                  fontSize: 40,
                                }}
                              />
                            </div>
                            <div>พิมพ์ Barcode ซ้ำ</div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={6}>
              <StickyBox>
                <Spin spinning={loadingData} tip="กำลังโหลดข้อมูล" size="large">
                  <Content>
                    <Card title="รายละเอียด Lab Order">{detail}</Card>
                    <Card title="Lab Note">{detailNote}</Card>
                    <Card title="ประเภทสิ่งส่งตรวจ">{detailThing}</Card>
                  </Content>
                </Spin>
              </StickyBox>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default LabReq;