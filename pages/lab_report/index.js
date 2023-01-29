import React, { useEffect, useState, useRef } from "react";
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
} from "antd";
import {
  DiffOutlined,
  PrinterOutlined,
  FileDoneOutlined,
  SaveOutlined,
  FormOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import axios from "axios";
import ReactToPrint from "react-to-print";
import DetailComponent from "./DetailComponent";
import DetailNoteComponent from "./DetailNoteComponent";
import LabOrderComponent from "./LabOrderComponent";
import LabOrderPrintComponent from "./LabOrderPrintComponent";
import LabOrderActionComponent from "./LabOrderActionComponent";

const API_server = "http://localhost:3000";
const API_post_list = API_server + "/api/lab_report";
const API_post_detail = API_server + "/api/lab_order_detail";

const API_post_barcode = API_server + "/api/lab_barcode";
const API_get_lab_form_head = API_server + "/api/get_lab_form_head";
const API_get_lab_items_group = API_server + "/api/get_lab_items_group";
const API_get_doctor = API_server + "/api/get_doctor";

const API_post_action = API_server + "/api/lab_report_action_event";
const API_post_cancel_reason = API_server + "/api/lab_order_reject";
const API_post_note = API_server + "/api/lab_order_note";

const API_report_detail = API_server + "/api/lab_report_detail";
const API_report_detail_update = API_server + "/api/lab_report_update";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const currDate = dayjs();
const beforeDate = currDate.subtract(4, "month");

function LabReport() {
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
  const [checkRerun, setCheckRerun] = useState(false);
  let clickRerun = (event) => {
    setCheckRerun(event.target.checked);
  };
  let acceptPrintBarcode = false;
  const changeAcceptPrintBarcode = (event) => {
    acceptPrintBarcode = event.target.checked;
  };
  let dataSubmitForm = [];
  const getFormData = (formCodeData, formCommentData) => {
    dataSubmitForm = {
      formCode: formCodeData,
      formComment: formCommentData,
      formDate: currDate.format("YYYY-MM-DD"),
      formTime: currDate.format("HH:mm:ss"),
    };
  };
  const showConfirm = (action) => {
    return axios.get(API_get_doctor).then(function (responseDoctor) {
      Modal.confirm({
        centered: true,
        title:
          action === "report" ? "ยืนยันรายงานผล LAB?" : "ยืนยันรับรองผล LAB?",
        content: (
          <LabOrderActionComponent
            action={action}
            orderNumber={selectedRadioKeys}
            getFormData={getFormData}
            doctorList={responseDoctor.data}
          />
        ),
        onOk() {
          actionControl(action);
        },
      });
    });
  };

  const showPrint = () => {
    return axios
      .post(API_post_detail, {
        id: selectedRadioKeys.join(),
      })
      .then(function (response) {
        console.log(response.data.lab_head[0]);
        Modal.info({
          centered: true,
          width: 730,
          title: "พิมพ์ Barcode",
          icon: <PrinterOutlined />,
          content: (
            <div ref={componentRef}>
              <LabOrderPrintComponent
                data={dataReport}
                key={dataReport.lab_order_number}
                detail={response.data.lab_head[0]}
              />
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
  const [dataReport, setDataReport] = useState([]);
  const [dataItemGroup, setDataItemGroup] = useState([]);
  const [dataItemGroupSelect, setDataItemGroupSelect] = useState("All");
  const [labOrderUpdate, setLabOrderUpdate] = useState([]);
  const inputLabOrderUpdate = (lab_items_code, lab_order_result_manual) => {
    let newData = labOrderUpdate;
    newData[lab_items_code] = lab_order_result_manual;
    setLabOrderUpdate(newData);
  };
  const changeItemGroupSelect = (event) => {
    setDataItemGroupSelect(event);
  };
  const [formDisable, setFormDisable] = useState(true);
  const clickActionForm = (action) => {
    if (action === "edit") {
      setFormDisable(false);
      setLoading(true);
    } else if (action === "report") {
      showConfirm(action);
    } else if (action === "approve") {
      showConfirm(action);
    } else if (action === "submit") {
      setLoadingData(true);
      let dataToUpdate = [];
      labOrderUpdate.map((item, index) => {
        dataToUpdate.push({
          lab_order_number: selectedRadioKeys.join(),
          lab_items_code: index,
          lab_order_result_manual: item,
        });
      });
      return axios
        .post(API_report_detail_update, dataToUpdate)
        .then(function (response) {
          setFormDisable(true);
          setLoading(false);
          setLoadingData(false);
          setLabOrderUpdate([]);
        });
    }
  };
  const [dataReportStatus, setDataReportStatus] = useState([]);
  const [statusList, setStatusList] = useState("All");
  const [dataCountReport, setDataCountReport] = useState({
    All: 0,
    Pending: 0,
    Process: 0,
    Completed: 0,
    Reported: 0,
    Approved: 0,
  });
  const [detail, setDetail] = useState(null);
  const [detailNote, setDetailNote] = useState(null);

  const [sStartDate, setSStartDate] = useState(beforeDate.format(dateFormat));
  const [sEndDate, setSEndDate] = useState(currDate.format(dateFormat));
  const [sType, setSType] = useState(1);
  const [sInput, setSInput] = useState(null);
  const [sWork, setSWork] = useState(1);
  const [sWorkType, setSWorkType] = useState("All");
  const [sWorkTypeList, setSWorkTypeList] = useState([]);
  const [sDepart, setSDepart] = useState("ALL");
  const [sAddress, setSAddress] = useState(null);

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

  useEffect(() => {
    const loadData = async () => {
      setDetail(null);
      setDataReport([]);
      setLoading(true);
      setDataReportStatus(null);

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
      return await axios.post(API_post_list, filter).then(function (response) {
        let dataArray = response.data;
        let count = {
          All: 0,
          Pending: 0,
          Process: 0,
          Completed: 0,
          Reported: 0,
          Approved: 0,
        };
        dataArray.forEach((d) => {
          if (d["h_status"] === "Pending") {
            count["Pending"] += 1;
          } else if (d["h_status"] === "Process") {
            count["Process"] += 1;
          } else if (d["h_status"] === "Completed") {
            count["Completed"] += 1;
          } else if (d["h_status"] === "Reported") {
            count["Reported"] += 1;
          } else if (d["h_status"] === "Approved") {
            count["Approved"] += 1;
          }
          count["All"] += 1;
        });
        setDataCountReport(count);
        getWorkTypeList(sWork);
        setData(dataArray);
        setLoading(false);
      });
    };

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
    } else {
      return axios
        .post(API_post_action, {
          id: selectedRadioKeys,
          action: action,
          form: dataSubmitForm,
        })
        .then(function (response) {
          console.log(response.data);
          messageApi.open({
            type: response.data.result === true ? "success" : "error",
            content: response.data.alert,
          });
          dataSubmitForm = [];
          setRefreshKey((oldKey) => oldKey + 1);
        });
    }
  };
  const loadReport = async (dataDetail) => {
    return axios
      .post(API_report_detail, {
        id: dataDetail.order_number,
      })
      .then(function (response) {
        let dataGroup = [{ label: "All", value: "All" }];
        setDataReport(response.data);
        response.data.map((item, index) => {
          if (
            index === 0 ||
            response.data[index].group_code !==
              response.data[index - 1].group_code
          ) {
            if (response.data[index].group_code !== null) {
              dataGroup.push({
                label: item["group_name"],
                value: item["group_code"],
              });
            }
          }
        });
        setDataItemGroup(dataGroup);
        setDataItemGroupSelect("All");
      });
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
    // {
    //   title: "P",
    //   dataIndex: "h_status",
    //   key: "h_status",
    // },
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
      ellipsis: true,
    },
    {
      title: "ชื่อใบสั่ง",
      dataIndex: "form_name",
      key: "form_name",
      ellipsis: true,
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
      ellipsis: true,
    },
    {
      title: "วันเวลาที่รับ",
      dataIndex: "time_receive_report",
      key: "time_receive_report",
      ellipsis: true,
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

  const [selectedRadioKeys, setSelectedRadioKeys] = useState([]);
  const rowSelection = {
    type: "radio",
    selectedRowKeys: selectedRadioKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      rowSelectFunc(selectedRows[0]);
    },
  };

  const rowSelectFunc = (record) => {
    setSelectedRadioKeys([record.order_number]);
    loadDetail(record);
    loadReport(record);
    setDataReportStatus(record.h_status);
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
            <Col xs={24} lg={24}>
              <Row>
                <Col
                  xs={24}
                  lg={3}
                  className="iconMenu"
                  style={{ textAlign: "center", display: "grid" }}
                >
                  <h1 style={{ margin: "auto 0" }}>รายงานผล LAB</h1>
                </Col>
                <Col xs={24} lg={15}>
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
                          <Radio.Group onChange={inputSDepart} value={sDepart}>
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
                <Col xs={24} lg={6}>
                  <Row style={{ padding: 24 }}>
                    <Col span={12}>
                      <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                        <Select
                          showSearch
                          style={{
                            width: 150,
                          }}
                          value={dataItemGroupSelect}
                          onChange={changeItemGroupSelect}
                          options={dataItemGroup}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                        <Checkbox onClick={clickRerun}>ปล่อยผล Rerun</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <h4 style={{ marginTop: 10 }}>
                        Status ={" "}
                        <span style={{ color: "red" }}>{dataReportStatus}</span>
                      </h4>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xs={24} lg={12}>
              <Content>
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("All")}
                          type={statusList === "All" ? "primary" : "default"}
                          block
                        >
                          All({dataCountReport["All"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Pending")}
                          type={
                            statusList === "Pending" ? "primary" : "default"
                          }
                          block
                        >
                          Pending({dataCountReport["Pending"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Process")}
                          type={
                            statusList === "Process" ? "primary" : "default"
                          }
                          block
                        >
                          Process(
                          {dataCountReport["Process"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Completed")}
                          type={
                            statusList === "Completed" ? "primary" : "default"
                          }
                          block
                        >
                          Completed(
                          {dataCountReport["Completed"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Reported")}
                          type={
                            statusList === "Reported" ? "primary" : "default"
                          }
                          block
                        >
                          Reported(
                          {dataCountReport["Reported"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Approved")}
                          type={
                            statusList === "Approved" ? "primary" : "default"
                          }
                          block
                        >
                          Approved(
                          {dataCountReport["Approved"].toLocaleString()})
                        </Button>
                      </Col>
                    </Row>
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
                          rowSelectFunc(record);
                        }, // click row
                      };
                    }}
                  />
                </Spin>
              </Content>
              <Row>
                <Col span={12}>
                  <Spin
                    spinning={loadingData}
                    tip="กำลังโหลดข้อมูล"
                    size="large"
                  >
                    <Content>
                      <Card title="::ความเห็นเจ้าหน้าที่">{detailNote}</Card>
                    </Content>
                  </Spin>
                </Col>
                <Col span={12}>
                  <Spin
                    spinning={loadingData}
                    tip="กำลังโหลดข้อมูล"
                    size="large"
                  >
                    <Content>
                      <Card title="::รายละเอียด">{detail}</Card>
                    </Content>
                  </Spin>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={12}>
              <Content>
                <Spin spinning={loadingData} tip="กำลังโหลดข้อมูล" size="large">
                  <Row>
                    <Col span={24}>
                      <LabOrderComponent
                        data={dataReport}
                        key={dataReport["lab_items_code"]}
                        id={dataReport["lab_items_code"]}
                        formDisable={formDisable}
                        labOrderData={inputLabOrderUpdate}
                        dataItemGroupSelect={dataItemGroupSelect}
                        checkRerun={checkRerun}
                      />
                    </Col>
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
                                  clickActionForm("submit");
                                }}
                                disabled={formDisable}
                              >
                                <div>
                                  <SaveOutlined
                                    style={{
                                      fontSize: 40,
                                    }}
                                  />
                                </div>
                                <div>บันทึกผล</div>
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
                                  clickActionForm("edit");
                                }}
                                disabled={
                                  !formDisable ||
                                  (dataReport.length > 0 ? false : true) ||
                                  (dataReportStatus !== "Pending" &&
                                    dataReportStatus !== "Process" &&
                                    dataReportStatus !== "Completed")
                                }
                              >
                                <div>
                                  <FormOutlined
                                    style={{
                                      fontSize: 40,
                                    }}
                                  />
                                </div>
                                <div>แก้ไขผล</div>
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
                                  clickActionForm("report");
                                }}
                                disabled={
                                  !formDisable ||
                                  (dataReport.length > 0 ? false : true) ||
                                  (dataReportStatus !== "Pending" &&
                                    dataReportStatus !== "Process" &&
                                    dataReportStatus !== "Completed")
                                }
                              >
                                <div>
                                  <DiffOutlined
                                    style={{
                                      fontSize: 40,
                                    }}
                                  />
                                </div>
                                <div>รายงานผล</div>
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
                                  clickActionForm("approve");
                                }}
                                disabled={
                                  !formDisable ||
                                  (dataReport.length > 0 ? false : true) ||
                                  dataReportStatus !== "Reported"
                                }
                              >
                                <div>
                                  <FileDoneOutlined
                                    style={{
                                      fontSize: 40,
                                    }}
                                  />
                                </div>
                                <div>รับรองผล</div>
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
                                disabled={
                                  !formDisable ||
                                  (dataReport.length > 0 ? false : true) ||
                                  dataReportStatus !== "Approved"
                                }
                              >
                                <div>
                                  <PrinterOutlined
                                    style={{
                                      fontSize: 40,
                                    }}
                                  />
                                </div>
                                <div>พิมพ์ผลซ้ำ</div>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Spin>
              </Content>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default LabReport;
