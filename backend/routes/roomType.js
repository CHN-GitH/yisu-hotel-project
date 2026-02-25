// 房型路由
const express = require('express');
const router = express.Router();
const RoomType = require('../models/roomType');
const Hotel = require('../models/hotel');
const { authMiddleware, merchantMiddleware } = require('../middlewares/auth');

// 获取房型列表
router.get('/:hotelId', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const user = req.user;

    // 检查酒店是否存在且属于当前商户
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限查看此酒店的房型'
      });
    }

    const roomTypes = await RoomType.getByHotelId(hotelId);

    res.json({
      code: 0,
      msg: '获取成功',
      data: roomTypes
    });
  } catch (error) {
    console.error('获取房型列表失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 创建房型
router.post('/', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { hotelId, name, price, area, bedType, capacity, floor, facilities, description, images } = req.body;

    if (!hotelId || !name || !price || !area || !bedType || !capacity) {
      return res.status(400).json({
        code: 400,
        msg: '请填写完整信息'
      });
    }

    // 检查酒店是否存在且属于当前商户
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限操作此酒店的房型'
      });
    }

    const newRoomType = await RoomType.create({
      hotel_id: hotelId,
      name,
      bed_type: bedType,
      area,
      capacity,
      price,
      breakfast: false,
      cancel_policy: '',
      image: images && images.length > 0 ? images[0] : '',
      floor: floor || null,
      facilities: facilities || [],
      description: description || ''
    });

    res.json({
      code: 0,
      msg: '创建成功',
      data: newRoomType
    });
  } catch (error) {
    console.error('创建房型失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 更新房型
router.put('/:id', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const roomTypeId = parseInt(req.params.id);
    const user = req.user;
    const { name, price, area, bedType, capacity, floor, facilities, description, images } = req.body;
    
    // 添加日志
    console.log('接收到的 images 字段:', images);

    // 检查房型是否存在
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({
        code: 404,
        msg: '房型不存在'
      });
    }

    // 检查酒店是否属于当前商户
    const hotel = await Hotel.findById(roomType.hotel_id);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限操作此房型'
      });
    }

    const updatedRoomType = await RoomType.update(roomTypeId, {
      name: name || roomType.name,
      price: price || roomType.price,
      area: area || roomType.area,
      bed_type: bedType || roomType.bed_type,
      capacity: capacity || roomType.capacity,
      images: images || roomType.images,
      floor: floor !== undefined ? floor : roomType.floor,
      facilities: facilities !== undefined ? facilities : roomType.facilities,
      description: description !== undefined ? description : roomType.description
    });

    res.json({
      code: 0,
      msg: '更新成功',
      data: updatedRoomType
    });
  } catch (error) {
    console.error('更新房型失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 删除房型
router.delete('/:id', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const roomTypeId = parseInt(req.params.id);
    const user = req.user;

    // 检查房型是否存在
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({
        code: 404,
        msg: '房型不存在'
      });
    }

    // 检查酒店是否属于当前商户
    const hotel = await Hotel.findById(roomType.hotel_id);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限删除此房型'
      });
    }

    // 删除房型
    await RoomType.delete(roomTypeId);

    res.json({
      code: 0,
      msg: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除房型失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

module.exports = router;
