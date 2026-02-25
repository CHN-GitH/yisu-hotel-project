import { Menu, Dropdown, Button, Space } from 'antd'
import type { MenuProps } from 'antd'
import { ApartmentOutlined, PlusOutlined } from '@ant-design/icons'
import { useHotel } from '@/contexts/HotelContext'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

interface SidebarContentProps {
  hotelList: Array<{ id: string; name: string }>
  menuItems: MenuProps['items']
  selectedKey: string
  onMenuClick: ({ key }: { key: string }) => void
}

function SidebarContent({ hotelList, menuItems, selectedKey, onMenuClick }: SidebarContentProps) {
  const { selectedHotel, setSelectedHotel } = useHotel()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state: RootState) => state.user)

  const isAdmin = userInfo?.role === 'admin'

  const selectedHotelName = hotelList.find(h => h.id === selectedHotel)?.name || '选择酒店'

  const hotelMenuItems: MenuProps['items'] = hotelList.map(hotel => ({
    key: hotel.id,
    label: hotel.name,
    onClick: () => {
      setSelectedHotel(hotel.id)
    }
  }))

  return (
    <>
      {!isAdmin && (
        <>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <Dropdown
              menu={{ items: hotelMenuItems }}
              trigger={['click']}
              placement="bottomLeft"
            >
              <Button
                type="text"
                block
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  height: 'auto',
                  textAlign: 'left',
                  background: '#f5f5f5',
                  borderRadius: 4
                }}
              >
                <Space>
                  <ApartmentOutlined />
                  <span style={{ fontWeight: 500 }}>{selectedHotelName}</span>
                </Space>
                <span style={{ color: '#999', fontSize: 12 }}>▼</span>
              </Button>
            </Dropdown>
          </div>

          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              block
              onClick={() => navigate('/hotel/create')}
            >
              新建酒店
            </Button>
          </div>
        </>
      )}

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={onMenuClick}
        style={{ flex: 1, borderRight: 0 }}
      />
    </>
  )
}

export default SidebarContent
