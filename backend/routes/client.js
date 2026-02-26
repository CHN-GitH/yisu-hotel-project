// 用户端路由
const express = require('express');
const router = express.Router();
const City = require('../models/city');
const Hotel = require('../models/hotel');
const RoomType = require('../models/roomType');
const Category = require('../models/category');
const HotSuggest = require('../models/hotSuggest');

// 获取所有城市
router.get('/all', async (req, res) => {
  try {
    const cities = await City.getAll();
    res.success(cities, '获取成功');
  } catch (error) {
    console.error('获取城市列表失败:', error);
    res.error(500, '服务器内部错误');
  }
});

// 获取热门城市
router.get('/hot', async (req, res) => {
  try {
    const hotCities = await City.getHotCities();
    const cityNames = hotCities.map(city => city.name);
    res.success(cityNames, '获取成功');
  } catch (error) {
    console.error('获取热门城市失败:', error);
    res.error(500, '服务器内部错误');
  }
});

// 搜索酒店
router.get('/result', async (req, res) => {
  try {
    const { keyword, cityId, priceRange, houseType, page = 1, size = 10 } = req.query;

    const params = {
      page: parseInt(page),
      page_size: parseInt(size)
    };

    // 处理搜索参数
    if (keyword) {
      params.keyword = keyword;
    }

    if (cityId) {
      // 根据城市ID获取城市名称
      const city = await City.findByName(cityId);
      if (city) {
        params.city = city.name;
      }
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
    }

    if (houseType) {
      // 处理房型过滤
      params.house_type = houseType;
    }

    // 搜索酒店
    const hotels = await Hotel.search(params);

    // 转换数据格式
    const transformedHotels = hotels.map(hotel => ({
      id: hotel.id,
      title: hotel.name,
      price: hotel.min_price,
      cover: hotel.cover_image || 'https://via.placeholder.com/400x300/1890ff/ffffff?text=酒店图片',
      address: hotel.address,
      tags: hotel.facilities && hotel.facilities.length > 0 ? hotel.facilities.slice(0, 3) : [],
      score: 4.5 // 模拟评分
    }));

    const responseData = {
      list: transformedHotels,
      total: transformedHotels.length,
      page: parseInt(page),
      size: parseInt(size)
    };

    res.success(responseData, '搜索成功');
  } catch (error) {
    console.error('搜索酒店失败:', error);
    res.error(500, '服务器内部错误');
  }
});

// 获取酒店详情
router.get('/infos', async (req, res) => {
  try {
    const { houseId } = req.query;

    if (!houseId) {
      return res.error(400, '请提供酒店ID');
    }

    const hotel = await Hotel.findById(parseInt(houseId));
    if (!hotel) {
      return res.error(404, '酒店不存在');
    }

    // 获取房型列表
    const roomTypes = await RoomType.getByHotelId(hotel.id);
    
    // ========== 核心修改：获取第一个房型名称（也可根据业务逻辑选择特定房型） ==========
    // 取第一个房型的名称，若没有房型则默认用酒店名称
    const firstRoomTypeName = roomTypes.length > 0 ? roomTypes[0].name : hotel.name;

    // 构建详情数据
    const detailData = {
      houseId: hotel.id,
      canSale: hotel.status === 'published',
      unitInstanceCount: roomTypes.length,
      mainPart: {
        topModule: {
          favoriteCount: 123,
          housePicture: {
            housePics: hotel.images && hotel.images.length > 0 ? 
              hotel.images.map((url, index) => ({
                title: `图片${index + 1}`,
                url: url,
                albumUrl: url,
                orderIndex: index,
                pictureExplain: null,
                enumPictureCategory: 1
              })) : [],
            preferredProPics: [],
            housePictureGroup: [],
            houseVRURL: null,
            houseVideoURL: null,
            houseVideoTimeSpan: 0,
            defaultPictureURL: hotel.cover_image || hotel.images[0] || '',
            picCount: hotel.images ? hotel.images.length : 0,
            houseVideos: null
          },
          promotionPic: null,
          // ========== 核心修改：将hotel.name改为firstRoomTypeName ==========
          houseName: hotel.name,
          roomName: firstRoomTypeName,
          houseTags: [],
          commentBrief: {
            overall: 4.5,
            scoreTitle: '非常好',
            commentBrief: '酒店环境优美，服务周到，交通便利',
            commentBriefV2: null,
            userAvatars: [],
            userAvatar: '',
            totalCount: 156,
            commentTabType: 1,
            veryGoodNewHouse: '',
            veryGoodNewHouseIcon: '',
            totalCountStr: '156条评论',
            healthText: '',
            healthFlag: 0,
            sort: 'default'
          },
          nearByPosition: {
            address: hotel.address,
            nearByPosition: null,
            areaName: hotel.address.split(' ')[0],
            tradeArea: ''
          },
          urgencyPromotion: null,
          redPacketTagData: null,
          atmosphereVo: null,
          checkInDate: '',
          checkOutDate: '',
          boardRanks: null,
          loginGuidance: null,
          diamondLevel: {
            icon: '',
            level: hotel.star_level,
            title: `${hotel.star_level}星级酒店`,
            desc: ''
          },
          headTag: null,
          businessDistrictConfig: null,
          briefComments: []
        },
        shareModule: {
          items: [],
          shareTags: []
        },
        introductionModule: {
          title: '酒店介绍',
          introduction: hotel.description || '暂无介绍',
          focus: null,
          blod: false,
          icon: null,
          color: null,
          tip: null,
          highLight: null,
          memberTitle: null,
          memberLevelStyle: null,
          maskTagText: '',
          titleType: 1,
          marketActivityId: 0
        },
        ensureModule: {
          icon: '',
          title: '品质保障',
          text: null,
          subIcon: '',
          titleTips: []
        },
        businessLicenseModule: [],
        dynamicModule: {
          moduleSort: ['facilityModule', 'landlordModule', 'commentModule', 'rulesModule', 'positionModule'],
          facilityModule: {
            topScroll: {
              icon: '',
              title: '酒店设施',
              text: '',
              tips: [],
              aloneLine: false,
              jumpUrl: null,
              timeStamp: Date.now(),
              titleTips: [],
              color: '',
              type: 0
            },
            houseContent: '',
            houseSummary: [],
            houseFacility: {
              specialFacilitys: hotel.facilities && hotel.facilities.length > 0 ? 
                hotel.facilities.map(facility => ({
                  isDeleted: false,
                  orderIndex: 0,
                  name: facility,
                  icon: null,
                  deleted: false,
                  tip: null
                })) : [],
              houseFacilitys: [],
              facilitySort: [],
              bedSizeDetailInfo: {
                houseTips: [],
                houseIntroduction: ''
              }
            }
          },
          landlordModule: {
            hotelId: hotel.id,
            topScroll: '',
            hotelLogo: '',
            hotelName: hotel.name,
            landlordLevelUrl: '',
            hotelTags: [],
            landlordTag: null,
            hotelSummary: [],
            businessType: 0,
            landlordLevel: 0,
            isReplyTimeMoreThan5Min: false
          },
          commentModule: {
            overall: 4.5,
            scoreTitle: '非常好',
            totalCount: 156,
            subScores: [],
            subScoresFocus: [],
            commentTagVo: [],
            comment: null,
            commentTabType: 1,
            commentAvatarsLimit: [],
            totalCountStr: '156条评论',
            evaluationModule: {
              data: [],
              totalCount: 156,
              moreNavigateUrl: ''
            }
          },
          rulesModule: {
            cancelRules: [],
            orderRules: [],
            checkInRules: [],
            checkinOtherInfo: []
          },
          positionModule: {
            cityId: 0,
            cityName: '',
            cityTerritoryType: 0,
            longitude: 0,
            latitude: 0,
            geoCoordSysType: '',
            address: hotel.address,
            ctripCityId: 0,
            tips: '',
            topScroll: null,
            mapUrl: '',
            unitGeoPositions: null,
            communityInfo: null,
            areaName: '',
            tradeArea: '',
            poi: ''
          },
          featureModule: null,
          landlordRecommendModule: {
            iconPictures: [],
            banner: ''
          },
          bannerModule: null
        },
        businessLicenseModuleTitle: '营业执照'
      },
      pricePart: {
        priceModule: {
          price: hotel.min_price,
          originalPrice: hotel.min_price * 1.2,
          discount: 0.8
        },
        contractModule: null
      },
      currentHouse: {
        houseId: hotel.id,
        houseName: firstRoomTypeName,
        houseSummary: '',
        defaultPictureURL: hotel.cover_image || '',
        productPrice: hotel.min_price,
        finalPrice: hotel.min_price,
        priceMark: '',
        allowBooking: hotel.status === 'published',
        markLine: false,
        houseTags: [],
        promoTags: [],
        rules: [],
        activityInfo: ''
      },
      floatingBall: null,
      debugInfo: ''
    };

    res.success(detailData, '获取成功');
  } catch (error) {
    console.error('获取酒店详情失败:', error);
    res.error(500, '服务器内部错误');
  }
});

// 获取首页房源列表
router.get('/houselist', async (req, res) => {
  try {
    const { page = 1 } = req.query;

    // 获取热门酒店
    const hotels = await Hotel.getHotHotels(10);

    // 转换数据格式
    const transformedHotels = hotels.map(hotel => ({
      discoveryContentType: 9,
      data: {
        houseId: hotel.id,
        houseName: hotel.name,
        productPrice: hotel.min_price,
        finalPrice: hotel.min_price,
        commentScore: '4.5',
        summaryText: hotel.description || '暂无介绍',
        location: hotel.address,
        cityId: 0,
        image: {
          url: hotel.cover_image || 'https://via.placeholder.com/400x300/1890ff/ffffff?text=酒店图片',
          width: 400,
          height: 300
        },
        priceTipBadge: null,
        iconTag: null,
        houseAdvert: null,
        activityInfo: null,
        sellingPoint: null,
        guideText: null,
        referencePriceDesc: null,
        poiLocation: null,
        houseTags: null,
        extendMap: {
          logicBit: ''
        },
        showHouseVideo: false
      }
    }));

    res.success(transformedHotels, '获取成功');
  } catch (error) {
    console.error('获取首页房源列表失败:', error);
    res.error(500, '服务器内部错误');
  }
});

// 获取首页热门推荐
router.get('/hotSuggests', async (req, res) => {
  try {
    const hotSuggests = await HotSuggest.getAll();

    // 转换数据格式
    const transformedSuggests = hotSuggests.map(suggest => ({
      id: suggest.id,
      title: suggest.title,
      image: suggest.image,
      desc: suggest.desc,
      link: suggest.link,
      hotValue: suggest.hot_value
    }));

    res.success(transformedSuggests, '获取成功');
  } catch (error) {
    console.error('获取热门推荐失败:', error);
    res.error(500, '服务器内部错误');
  }
});

// 获取首页分类
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.getAll();

    // 转换数据格式
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      desc: category.desc,
      children: []
    }));

    res.success(transformedCategories, '获取成功');
  } catch (error) {
    console.error('获取分类失败:', error);
    res.error(500, '服务器内部错误');
  }
});

module.exports = router;