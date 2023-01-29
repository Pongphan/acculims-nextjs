import { Empty, Input, Popover, Checkbox, Tooltip as TT } from "antd";
import { LineChartOutlined, WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LabOrderComponent = (props) => {
  const { data, formDisable, labOrderData, dataItemGroupSelect, checkRerun } =
    props;
  const [titleInformation, setTitleInformation] = useState("");
  const [information, setInformation] = useState("");

  const changeInput_lab_order_result_manual = (event) => {
    labOrderData(event.target.id, event.target.value);
  };
  const optionsGraph = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  const openGraph = (lab_items_name, dataGraphItem, isNotNumber) => {
    setTitleInformation(
      <>
        <LineChartOutlined /> ประวัติข้อมูล {lab_items_name}
      </>
    );
    let dataType;
    if (isNotNumber) {
      dataType = (
        <table
          style={{
            width: "100%",
            overflowX: "auto",
            borderCollapse: "collapse",
          }}
        >
          <thead className={"ant-table-thead"}>
            <tr>
              <th
                width={"50%"}
                style={{ padding: "8px 8px", border: "1px solid #f0f0f0" }}
              >
                วันที่
              </th>
              <th style={{ padding: "8px 8px", border: "1px solid #f0f0f0" }}>
                ค่า
              </th>
            </tr>
          </thead>
          <tbody>
            {dataGraphItem.map((itemGraph) => {
              if (itemGraph["value"] !== null) {
                return (
                  <tr key={itemGraph["value"]}>
                    <td style={{ border: "1px solid #f0f0f0" }}>
                      {itemGraph["label"]}
                    </td>
                    <td style={{ border: "1px solid #f0f0f0" }}>
                      {itemGraph["value"]}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      );
    } else {
      let dataRearange = {};
      dataGraphItem.map((graphItem) => {
        if (graphItem["value"] !== null) {
          dataRearange[graphItem["label"]] = parseFloat(graphItem["value"]);
        }
      });
      let dataGraph = {
        datasets: [
          {
            label: lab_items_name,
            data: dataRearange,
            borderColor: "rgb(5,145,255)",
            backgroundColor: "rgba(5,145,255,0.5)",
          },
        ],
      };
      dataType = <Line options={optionsGraph} data={dataGraph} />;
    }
    setInformation(<div style={{ width: "400px" }}>{dataType}</div>);
  };

  const replaceHistory = (data) => {
    let dataRaw = [];
    if (data["lab_order_result" !== null]) {
      dataRaw = [
        {
          value: data["lab_order_result"],
          label: data["order_date_time"],
        },
        {
          value: null,
          label: null,
        },
        {
          value: null,
          label: null,
        },
        {
          value: null,
          label: null,
        },
        {
          value: null,
          label: null,
        },
      ];
    } else {
      for (let i = 0; i < 5; i++) {
        if (!!data[i]) {
          dataRaw[i] = {
            value: data[i]["lab_order_result"],
            label: data[i]["order_date_time"],
          };
        } else {
          dataRaw[i] = {
            value: null,
            label: null,
          };
        }
      }
    }
    return dataRaw;
  };

  const warningModalBox = (record) => {
    console.log(record);
  };

  return (
    <div>
      <table
        style={{
          display: "block",
          overflowX: "auto",
          whiteSpace: "nowrap",
          borderCollapse: "collapse",
          maxHeight: "840px",
        }}
      >
        <thead className={"ant-table-thead"}>
          <tr>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
            >
              Test Name
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"10%"}
            >
              ผลตรวจเครื่อง
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"15%"}
            >
              ผลตรวจเอง
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"5%"}
            >
              Flag
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"5%"}
            ></th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"8%"}
            >
              Rerun
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"5%"}
            ></th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"15%"}
            >
              หน่วย
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"15%"}
            >
              ค่าปกติ
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"8%"}
            >
              P#1
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"8%"}
            >
              P#2
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"8%"}
            >
              P#3
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"8%"}
            >
              P#4
            </th>
            <th
              style={{ padding: "8px 8px", backgroundColor: "#f1ffb8" }}
              className={"ant-table-cell"}
              width={"8%"}
            >
              P#5
            </th>
          </tr>
        </thead>
        <tbody className={"ant-row-design"}>
          {data.length > 0 ? (
            data.map((item, index) => {
              if (
                dataItemGroupSelect === "All" ||
                dataItemGroupSelect === item["group_code"]
              ) {
                let text;
                let arrayHistory;
                if (!!item["history"]) {
                  arrayHistory = replaceHistory(item["history"]);
                } else {
                  arrayHistory = [
                    {
                      value: data["lab_order_result"],
                      label: data["order_date_time"],
                    },
                    {
                      value: null,
                      label: null,
                    },
                    {
                      value: null,
                      label: null,
                    },
                    {
                      value: null,
                      label: null,
                    },
                    {
                      value: null,
                      label: null,
                    },
                  ];
                }
                if (
                  index === 0 ||
                  data[index].sub_code !== data[index - 1].sub_code
                ) {
                  if (data[index].sub_code !== null) {
                    text = (
                      <tr style={{ borderTop: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "8px 8px" }} colSpan={11}>
                          {item["lab_items_sub_group_name"]}
                        </td>
                      </tr>
                    );
                  } else {
                    text = null;
                  }
                } else {
                  text = null;
                }

                return (
                  <div key={index}>
                    {text}
                    <tr>
                      <td
                        style={{
                          padding: "8px 8px",
                          border: "1px solid #f0f0f0",
                          cursor: "pointer",
                        }}
                        onMouseOver={() => {
                          openGraph(
                            item["lab_items_name"],
                            [
                              {
                                value: item["lab_order_result_manual"]
                                  ? item["lab_order_result_manual"]
                                  : item["lab_order_result_instrument"],
                                label: item["order_date_time"],
                              },
                              ...arrayHistory,
                            ],
                            isNaN(item["lab_order_result_manual"]) ||
                              isNaN(item["lab_order_result_instrument"]) ||
                              isNaN(arrayHistory[0]["value"]) ||
                              isNaN(arrayHistory[1]["value"]) ||
                              isNaN(arrayHistory[2]["value"]) ||
                              isNaN(arrayHistory[3]["value"]) ||
                              isNaN(arrayHistory[4]["value"])
                          );
                        }}
                      >
                        <Popover
                          placement="leftTop"
                          content={information}
                          title={titleInformation}
                        >
                          {item["lab_items_sub_group_name"] !== null ? (
                            <div style={{ width: "100%", paddingLeft: "15px" }}>
                              {item["lab_items_name"]}
                            </div>
                          ) : (
                            <div style={{ width: "100%" }}>
                              {item["lab_items_name"]}
                            </div>
                          )}
                        </Popover>
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        {item["lab_order_result_instrument"]}
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        <Input
                          defaultValue={item["lab_order_result_manual"]}
                          onChange={changeInput_lab_order_result_manual}
                          id={item["lab_items_code"]}
                          key={
                            item["lab_order_number"] + item["lab_items_code"]
                          }
                          disabled={formDisable}
                        />
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        {item["flag"] === "H" ? (
                          <b style={{ color: "red" }}>{item["flag"]}</b>
                        ) : item["flag"] === "L" ? (
                          <b style={{ color: "blue" }}>{item["flag"]}</b>
                        ) : (
                          <>{item["flag"]}</>
                        )}
                      </td>
                      <td style={{ border: "1px solid #f0f0f0", color: "red" }}>
                        {item["lab_order_result_rerun"] ? (
                          <WarningOutlined onClick={warningModalBox} />
                        ) : null}
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        {item["lab_order_result_rerun"]}
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        <Checkbox
                          key={
                            item["lab_order_number"] + item["lab_items_code"]
                          }
                          checked={
                            checkRerun || !!item["lab_order_result_rerun"]
                          }
                          onChange={warningModalBox}
                        />
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        {item["lab_items_unit"]}
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        {item["lab_items_normal_value"]}
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        <TT title={arrayHistory[0]["label"]}>
                          {arrayHistory[0]["value"]}
                        </TT>
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        <TT title={arrayHistory[1]["label"]}>
                          {arrayHistory[1]["value"]}
                        </TT>
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        <TT title={arrayHistory[2]["label"]}>
                          {arrayHistory[2]["value"]}
                        </TT>
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        <TT title={arrayHistory[3]["label"]}>
                          {arrayHistory[3]["value"]}
                        </TT>
                      </td>
                      <td style={{ border: "1px solid #f0f0f0" }}>
                        <TT title={arrayHistory[4]["label"]}>
                          {arrayHistory[4]["value"]}
                        </TT>
                      </td>
                    </tr>
                  </div>
                );
              }
            })
          ) : (
            <tr key={"55555"}>
              <td colSpan={11}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LabOrderComponent;
