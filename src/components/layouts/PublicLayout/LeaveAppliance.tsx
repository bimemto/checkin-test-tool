/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  DatePicker,
  Divider,
  Form,
  message,
  notification,
  Row,
  Select,
  Space
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import { useEffect, useState } from 'react';
import IndexDB from '../../../utils/db';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import Search from 'antd/lib/input/Search';
import dayjs from 'dayjs';

const { Option } = Select;

export default function Test() {
  const [form] = Form.useForm();
  const [formTwo] = Form.useForm();
  const [listScript, setListScript] = useState<any[]>([]);
  const [listLeaveType, setListLeaveType] = useState<any[]>([]);
  const [listShifts, setListShifts] = useState<any>([]);
  const [listLeaveApplianceType, setListLeaveApplianceType] = useState<any[]>(
    []
  );
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [approval, setApproval] = useState<any>(null);

  console.log(approval);
  const fetchListScript = async () => {
    const db = await IndexDB.getAllObjects();
    setListScript(db);
  };

  const fetchListLeaveType = async (values: any) => {
    const { header } = values;
    const result = await axios({
      url: `https://api-hrm.dev.acheckin.vn/v1/mobile/user-workspace-leave-scopes/list`,
      headers: {
        ...JSON.parse(header)
      },
      method: 'GET'
    });
    const date = moment().format('YYYYMMDD');
    const resultShifts = await axios({
      url: `https://api-hrm.dev.acheckin.vn/v2/mobile/user-workspaces/daily-work-statistics?date=${date}&key=shifts`,
      headers: {
        ...JSON.parse(header)
      },
      method: 'GET'
    });
    const resultApproval = await axios({
      url: `https://api-hrm.dev.acheckin.vn/v1/mobile/approvals/list`,
      headers: {
        ...JSON.parse(header)
      },
      method: 'GET'
    });

    const findApproval = resultApproval.data.data.rows.find((item: any) => {
      if (item.approval_category === 'LEAVE') {
        return item;
      }
    });
    setApproval(findApproval);
    setListShifts(resultShifts.data.data);
    setListLeaveType(result.data.data);
  };

  useEffect(() => {
    fetchListScript();
  }, []);

  const renderLeaveApplianceType = (index: any, field: any) => {
    const findLeaveApplianceType = listLeaveApplianceType.find(
      (item: any) => item.index === index
    );
    const applianceTimeType = findLeaveApplianceType?.appliance_time_type;
    if (applianceTimeType === 'TIME') {
      return (
        <Space>
          <Form.Item
            {...field}
            label="Thời gian bắt đầu"
            name={[field.name, 'from_date']}
            valuePropName={'date'}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{
                defaultValue: dayjs('00:00:00', 'HH:mm:ss') as any
              }}
              defaultValue={findLeaveApplianceType?.from_date}
            />
          </Form.Item>
          <Form.Item
            {...field}
            label="Thời gian kết thúc"
            name={[field.name, 'to_date']}
            valuePropName={'date'}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{
                defaultValue: dayjs('00:00:00', 'HH:mm:ss') as any
              }}
              defaultValue={findLeaveApplianceType?.to_date}
            />
          </Form.Item>
        </Space>
      );
    }
    if (applianceTimeType === 'SHIFT_HOUR') {
      return (
        <Space>
          <Form.Item
            {...field}
            label="Chọn ngày"
            name={[field.name, 'date']}
            valuePropName={'date'}
            defaultValue={moment(findLeaveApplianceType?.date)}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item {...field} label="Chọn ca" name={[field.name, 'shift_id']}>
            <Select style={{ width: 230 }}>
              {listShifts.map((item: any) => (
                <Option
                  key={item.metadata.shift_id}
                  value={item.metadata.shift_id}
                >
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
      );
    }
    return <></>;
  };

  const handleSaveScripts = async (name: string) => {
    const values = await formTwo.validateFields();
    const { leave_appliances } = values;
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const data = {
      id: name + id,
      name,
      leave_appliances
    };
    await IndexDB.addObject(data);
    fetchListScript();
  };

  const removeAllScript = async () => {
    await IndexDB.clearObjectStore();
    fetchListScript();
  };

  const removeScript = async () => {
    await IndexDB.deleteObject(selectedScript);
    fetchListScript();
  };
  const handleSelectScript = async (value: any) => {
    setSelectedScript(value);
    const findScript = listScript.find((item) => item.id === value);

    if (findScript.leave_appliances) {
      const listLeaveApplianceTypeClone = [] as any;
      findScript.leave_appliances.forEach((item: any, index: number) => {
        listLeaveApplianceTypeClone.push({
          index,
          appliance_time_type: item.appliance_time_type,
          from_date: moment(item.from_date),
          to_date: moment(item.to_date),
          date: moment(item.date)
        });
      });
      const list = findScript.leave_appliances.map((item: any) => {
        return {
          ...item,
          date: moment(item.date),
          from_date: moment(item.from_date),
          to_date: moment(item.to_date)
        };
      });
      formTwo.setFieldsValue({
        leave_appliances: list
      });
      setListLeaveApplianceType(listLeaveApplianceTypeClone);
    }
  };

  const sendAllLeave = async () => {
    const values = await formTwo.validateFields();
    const { leave_appliances } = values;
    for (let i = 0; i < leave_appliances.length; i++) {
      const item = leave_appliances[i];
      const {
        appliance_time_type,
        from_date,
        to_date,
        date,
        shift_id,
        reason,
        leave_type_id
      } = item;
      const data = {
        approval_id: approval.id,
        leave_type_id,
        appliance_time_type,
        reason,
        from_datetime: from_date
          ? Number(moment(dayjs(from_date).valueOf()).format('YYYYMMDDHHmm'))
          : null,
        to_datetime: to_date
          ? Number(moment(dayjs(from_date).valueOf()).format('YYYYMMDDHHmm'))
          : null,
        date: date
          ? Number(moment(dayjs(date).valueOf()).format('YYYYMMDD'))
          : null,
        shift_id
      };
      const { date: dateOfData, shift_id: shiftOfData, ...dataTime } = data;
      const { from_datetime, to_datetime, ...dataShift } = item;
      try {
        await axios({
          url: `https://api-hrm.dev.acheckin.vn/v2/mobile/user-workspace-leave-type-appliances/create`,
          headers: {
            ...JSON.parse(form.getFieldValue('header'))
          },
          method: 'POST',
          data: appliance_time_type === 'TIME' ? dataTime : dataShift
        });
      } catch (error) {
        console.log(error);
        notification.error({
          message: 'Gửi đơn thất bại',
          description: `Gửi đơn thất bại tại vị trí ${i + 1}, lỗi: ${
            (error as any).response.data.message
          }`
        });
      }
    }
    message.success('Gửi đơn thành công');
  };

  return (
    <>
      <Row justify="center">
        <Form
          form={form}
          style={{ width: '1000px' }}
          layout="vertical"
          onFinish={fetchListLeaveType}
        >
          <Form.Item name="header" label="Header">
            <TextArea showCount />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lấy danh sách loại ngày nghỉ
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <Row justify="center">
        <Space style={{ width: '1000px' }}>
          <Select
            placeholder="Chọn kịch bản "
            style={{ width: '200px' }}
            value={selectedScript}
            onChange={(value) => handleSelectScript(value)}
            allowClear
          >
            {listScript.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={() => fetchListScript()}>
            Cập nhật
          </Button>
          <Button danger onClick={removeScript}>
            Xóa kịch bản đang chọn
          </Button>
          <Button danger onClick={removeAllScript}>
            Xóa tất cả kịch bản
          </Button>
        </Space>
      </Row>
      <Divider />
      <Row justify="center">
        <Form
          form={formTwo}
          name="dynamic_form_complex"
          style={{ width: '1000px' }}
          autoComplete="off"
          layout="vertical"
        >
          <Form.List name="leave_appliances">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline" direction="vertical">
                    <Form.Item>
                      <Form.Item
                        {...field}
                        label="Chọn loại ngày nghỉ"
                        name={[field.name, 'leave_type_id']}
                      >
                        <Select style={{ width: 330 }}>
                          {listLeaveType.map((item) => (
                            <Option key={item.id} value={item.leave_type_id}>
                              {item.leave_types.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Form.Item>
                    <Row>
                      <Form.Item
                        {...field}
                        label="Chọn loại gửi đơn"
                        name={[field.name, 'appliance_time_type']}
                      >
                        <Select
                          style={{ width: 230 }}
                          onSelect={(value: string) => {
                            const listLeaveApplianceTypeClone = [
                              ...listLeaveApplianceType
                            ];
                            const findLeaveApplianceType =
                              listLeaveApplianceTypeClone.find(
                                (item: any) => item.index === index
                              );
                            if (findLeaveApplianceType) {
                              findLeaveApplianceType.appliance_time_type =
                                value;
                            } else {
                              listLeaveApplianceTypeClone.push({
                                index,
                                appliance_time_type: value
                              });
                            }
                            setListLeaveApplianceType(
                              listLeaveApplianceTypeClone
                            );
                          }}
                        >
                          <Option value="TIME">Khoảng thời gian</Option>
                          <Option value="SHIFT_HOUR">Theo ca</Option>
                        </Select>
                      </Form.Item>
                      <>{renderLeaveApplianceType(index, field)}</>
                    </Row>
                    <Form.Item
                      {...field}
                      label="Lý do"
                      name={[field.name, 'reason']}
                    >
                      <TextArea />
                    </Form.Item>
                    <Button
                      onClick={() => remove(field.name)}
                      style={{
                        marginBottom: '10px'
                      }}
                    >
                      Xóa đơn nghỉ
                    </Button>
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm đơn nghỉ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" onClick={sendAllLeave}>
              Gửi toàn bộ đơn
            </Button>
          </Form.Item>
          <Form.Item>
            <Search
              placeholder="Nhập tên kịch bản"
              enterButton="Lưu kịch bản"
              onSearch={(value) => handleSaveScripts(value)}
            />
          </Form.Item>
        </Form>
      </Row>
    </>
  );
}
