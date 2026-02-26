// 酒店路由
const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel');
const RoomType = require('../models/roomType');
const { authMiddleware, adminMiddleware, merchantMiddleware } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// 创建酒店
router.post('/create', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const merchantId = req.user.id;
    const { name, nameEn, address, star, minPrice, openDate, facilities, discountInfo, images } = req.body;

    if (!name || !address || !star || !minPrice) {
      return res.status(400).json({
        code: 400,
        msg: '请填写完整信息'
      });
    }

    const newHotel = await Hotel.create({
      name,
      name_en: nameEn || '',
      address,
      star_level: star,
      min_price: minPrice,
      cover_image: '',
      images: images || [],
      facilities: facilities || [],
      description: discountInfo || '',
      open_date: openDate || '',
      status: 'draft',
      merchant_id: merchantId
    });

    res.json({
      code: 0,
      msg: '创建成功',
      data: {
        id: newHotel.id,
        nameCn: newHotel.name,
        nameEn: newHotel.name_en,
        address: newHotel.address,
        star: newHotel.star_level,
        minPrice: newHotel.min_price,
        status: newHotel.status
      }
    });
  } catch (error) {
    console.error('创建酒店失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 获取酒店列表
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { star, status } = req.query;

    const params = {};
    if (user.role === 'merchant') {
      params.merchant_id = user.id;
    }
    if (star) {
      params.star_level = parseInt(star);
    }
    if (status) {
      params.status = status === 'online' ? 'published' :
        status === 'pending' ? 'under_review' : status;
    }

    const hotels = await Hotel.getList(params);

    // 转换数据格式
    const transformedHotels = hotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      nameCn: hotel.name,
      nameEn: hotel.name_en,
      address: hotel.address,
      star: hotel.star_level,
      minPrice: hotel.min_price,
      coverImage: hotel.cover_image,
      status: hotel.status === 'published' ? 'online' :
        hotel.status === 'under_review' ? 'pending' :
          hotel.status === 'paused' ? 'paused' : hotel.status,
      rejectReason: hotel.reject_reason,
      pendingAction: hotel.pending_action
    }));

    res.json({
      code: 0,
      msg: '获取成功',
      data: transformedHotels
    });
  } catch (error) {
    console.error('获取酒店列表失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 获取酒店详情
router.get('/detail/:id', authMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const user = req.user;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    // 检查权限
    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限查看此酒店'
      });
    }

    // 获取房型列表
    const roomTypes = await RoomType.getByHotelId(hotelId);

    res.json({
      code: 0,
      msg: '获取成功',
      data: {
        id: hotel.id,
        name: hotel.name,
        nameCn: hotel.name,
        nameEn: hotel.name_en,
        address: hotel.address,
        star: hotel.star_level,
        minPrice: hotel.min_price,
        coverImage: hotel.cover_image,
        images: hotel.pending_data?.images || hotel.images,
        facilities: hotel.pending_data?.facilities || hotel.facilities,
        description: hotel.pending_data?.description || hotel.description,
        openDate: hotel.pending_data?.openDate || hotel.open_date,
        status: hotel.status === 'published' ? 'online' :
          hotel.status === 'under_review' ? 'pending' :
            hotel.status === 'paused' ? 'paused' : hotel.status,
        rejectReason: hotel.reject_reason,
        pendingAction: hotel.pending_action,
        originalStatus: hotel.original_status,
        roomTypes: roomTypes
      }
    });
  } catch (error) {
    console.error('获取酒店详情失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 更新酒店
router.put('/update/:id', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const user = req.user;
    const { nameCn, nameEn, address, star, minPrice, openDate, facilities, discountInfo, images } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    // 检查权限
    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限修改此酒店'
      });
    }

    // 保存待更新数据
    const pendingData = {
      name: nameCn || hotel.name,
      name_en: nameEn !== undefined ? nameEn : hotel.name_en,
      address: address || hotel.address,
      star_level: star || hotel.star_level,
      min_price: minPrice || hotel.min_price,
      facilities: facilities !== undefined ? facilities : hotel.facilities,
      description: discountInfo !== undefined ? discountInfo : hotel.description,
      open_date: openDate !== undefined ? openDate : hotel.open_date,
      images: images !== undefined ? images : hotel.images
    };

    await Hotel.update(hotelId, {
      original_status: hotel.status,
      pending_data: pendingData,
      pending_action: 'update',
      status: 'under_review'
    });

    res.json({
      code: 0,
      msg: '已提交审核，请等待管理员审核',
      data: null
    });
  } catch (error) {
    console.error('更新酒店失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 发布酒店
router.post('/publish/:id/publish', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const user = req.user;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    // 检查权限
    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限操作此酒店'
      });
    }

    await Hotel.update(hotelId, {
      original_status: hotel.status,
      pending_action: 'publish',
      status: 'under_review'
    });

    res.json({
      code: 0,
      msg: '已提交审核，请等待管理员审核',
      data: null
    });
  } catch (error) {
    console.error('发布酒店失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 下线酒店
router.post('/publish/:id/offline', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const user = req.user;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    // 检查权限
    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限操作此酒店'
      });
    }

    await Hotel.update(hotelId, {
      original_status: hotel.status,
      pending_action: 'offline',
      status: 'under_review'
    });

    res.json({
      code: 0,
      msg: '已提交审核，请等待管理员审核',
      data: null
    });
  } catch (error) {
    console.error('下线酒店失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 暂停营业
router.post('/pause/:id', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const user = req.user;

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
        msg: '无权限操作此酒店'
      });
    }

    if (hotel.status !== 'published') {
      return res.status(400).json({
        code: 400,
        msg: '只有已上线的酒店才能暂停营业'
      });
    }

    await Hotel.update(hotelId, {
      status: 'paused'
    });

    res.json({
      code: 0,
      msg: '已暂停营业',
      data: null
    });
  } catch (error) {
    console.error('暂停营业失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 恢复营业
router.post('/resume/:id', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const user = req.user;

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
        msg: '无权限操作此酒店'
      });
    }

    if (hotel.status !== 'paused') {
      return res.status(400).json({
        code: 400,
        msg: '只有暂停营业的酒店才能恢复营业'
      });
    }

    await Hotel.update(hotelId, {
      status: 'published'
    });

    res.json({
      code: 0,
      msg: '已恢复营业',
      data: null
    });
  } catch (error) {
    console.error('恢复营业失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 删除酒店
router.delete('/delete/:id', authMiddleware, merchantMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const user = req.user;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    // 检查权限
    if (user.role === 'merchant' && hotel.merchant_id !== user.id) {
      return res.status(403).json({
        code: 403,
        msg: '无权限删除此酒店'
      });
    }

    // 删除酒店
    await Hotel.delete(hotelId);

    res.json({
      code: 0,
      msg: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('删除酒店失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 审核酒店（管理员）
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const { status, reason } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: '酒店不存在'
      });
    }

    if (status === 'approved') {
      // 审核通过
      if (hotel.pending_action === 'publish') {
        await Hotel.update(hotelId, {
          ...(hotel.pending_data || {}),
          status: 'published',
          pending_action: null,
          pending_data: null,
          original_status: null,
          reject_reason: null
        });
      } else if (hotel.pending_action === 'offline') {
        await Hotel.update(hotelId, {
          ...(hotel.pending_data || {}),
          status: 'offline',
          pending_action: null,
          pending_data: null,
          original_status: null,
          reject_reason: null
        });
      } else if (hotel.pending_action === 'update') {
        // 应用待更新数据
        if (hotel.pending_data) {
          await Hotel.update(hotelId, {
            ...hotel.pending_data,
            status: hotel.original_status || 'published',
            pending_action: null,
            pending_data: null,
            original_status: null,
            reject_reason: null
          });
        }
      }
    } else if (status === 'rejected') {
      // 审核拒绝
      await Hotel.update(hotelId, {
        status: hotel.original_status || 'published',
        reject_reason: reason,
        pending_action: null,
        pending_data: null,
        original_status: null
      });
    }

    res.json({
      code: 0,
      msg: '审核操作成功',
      data: null
    });
  } catch (error) {
    console.error('审核酒店失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

// 上传酒店图片
router.post('/upload', authMiddleware, merchantMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        msg: '请选择文件'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      code: 0,
      msg: '上传成功',
      data: {
        url: imageUrl
      }
    });
  } catch (error) {
    console.error('上传图片失败:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误'
    });
  }
});

module.exports = router;
