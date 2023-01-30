const DetailComponent = (props) => {
  const { data, lab_profile, lab_single } = props;
  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>
        <tr>
          <td colSpan={3}>-------------------------------------------</td>
        </tr>

        <tr>
          <td>ประเภท</td>
          <td>:</td>
          <td>{!!data ? data["department"] : ""}</td>
        </tr>
        <tr>
          <td>Remark</td>
          <td>:</td>
          <td>{!!data ? data["lab_head_remark"] : ""}</td>
        </tr>
        <tr>
          <td>Lab No</td>
          <td>:</td>
          <td>{!!data ? data["lab_order_number"] : ""}</td>
        </tr>
        <tr>
          <td>HN</td>
          <td>:</td>
          <td>{!!data ? data["hn"] : ""}</td>
        </tr>
        <tr>
          <td>ชื่อ-สกุล</td>
          <td>:</td>
          <td>{!!data ? data["name"] : ""}</td>
        </tr>
        <tr>
          <td>อายุ</td>
          <td>:</td>
          <td>
            {!!data ? data["year"] : "-"} ปี {!!data ? data["month"] : "-"}{" "}
            เดือน
          </td>
        </tr>
        <tr>
          <td>เพศ</td>
          <td>:</td>
          <td>{!!data ? data["SEX"] : ""}</td>
        </tr>
        <tr>
          <td>วันเดือนปีเกิด</td>
          <td>:</td>
          <td>{!!data ? data["birthday"] : ""}</td>
        </tr>
        <tr>
          <td>ผู้ตรวจส่ง</td>
          <td>:</td>
          <td>{!!data ? data["docname"] : ""}</td>
        </tr>
        <tr>
          <td>Ward</td>
          <td>:</td>
          <td>{!!data ? data["wardname"] : ""}</td>
        </tr>
        <tr>
          <td>วันที่ตรวจส่ง</td>
          <td>:</td>
          <td>{!!data ? data["order_date"] : ""}</td>
        </tr>
        <tr>
          <td>เวลาที่ส่งตรวจ</td>
          <td>:</td>
          <td>{!!data ? data["order_time"] : ""}</td>
        </tr>
        <tr>
          <td>ห้องที่ส่งตรวจ</td>
          <td>:</td>
          <td>{!!data ? data["room"] : ""}</td>
        </tr>
        <tr>
          <td>สิทธิ์</td>
          <td>:</td>
          <td>{!!data ? data["ptname"] : ""}</td>
        </tr>
        <tr>
          <td colSpan={3}>------------- [ TEST ORDER ] ---------------</td>
        </tr>
        <tr>
          <td colSpan={3}>Lab Profile : </td>
        </tr>
        {!!lab_profile ? (
          lab_profile.map((items, index) => {
            return (
              <tr
                key={
                  items["lab_order_number"] + items["lab_profile"].toString()
                }
              >
                <td colSpan={3} style={{ paddingLeft: "15px" }}>
                  {index + 1}. {items["lab_profile"]}
                </td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
        <tr>
          <td colSpan={3}>Lab Single : </td>
        </tr>
        {!!lab_single ? (
          lab_single.map((items, index) => {
            return (
              <tr
                key={
                  items["lab_order_number"] +
                  items["lab_items_group_name"].toString()
                }
              >
                <td colSpan={3} style={{ paddingLeft: "15px" }}>
                  {index + 1}. {items["lab_items_group_name"]}
                </td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
      </tbody>
    </table>
  );
};

export default DetailComponent;
