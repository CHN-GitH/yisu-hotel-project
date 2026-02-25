// 酒店详情页 - 评论
import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import DetailSlot from './DetailSlot';
import '../../styles/HotelDetail.scss';

// 子评分项类型
interface SubScore {
  text: string;
  focusText?: string;
}

// 评论标签类型
interface CommentTag {
  color: string;
  backgroundColor: string;
  text: string;
  selected: boolean;
  selectParam: string;
  focusColor: string;
  borderColor: string;
  texts: string[];
}

// 评论内容类型
interface Comment {
  userAvatars: string;
  userName: string;
  checkInDate: string;
  memberLevelIcon: string | null;
  overall: number;
  commentDetail: string;
  scoreTags: any[];
  pictureList: any;
  goodCommentUrl: string | null;
  commentTopicList: any;
  commentTrySleepIconUrl: string | null;
  commentTrySleepText: string | null;
  houseName: string;
  location: string;
}

// 热门评论数据类型
interface HotExportData {
  overall: number;
  scoreTitle: string;
  totalCount: number;
  totalCountStr: string;
  subScores: string[];
  subScoresFocus: SubScore[];
  commentTagVo: CommentTag[];
  comment: Comment;
  commentTabType: number;
  commentAvatarsLimit: string[];
  evaluationModule: {
    data: any[];
    totalCount: number;
    moreNavigateUrl: string;
  };
}

interface DetailHotExportProps {
  hotexportdata?: Partial<HotExportData>;
}

export default function DetailHotExport({ hotexportdata = {} }: DetailHotExportProps) {
  const [value] = useState<number>(hotexportdata?.overall || 0);

  // 如果没有数据，不渲染
  if (!hotexportdata || Object.keys(hotexportdata).length === 0) {
    return null;
  }

  return (
    <View className='detail-hot-export'>
      <DetailSlot 
        title='热门评论' 
        moreText={`${hotexportdata.totalCountStr || '0'}条评论`}
      >
        <View className='comment-container'>
          {/* 评分头部 */}
          <View className='comment-header'>
            <View className='header-left'>
              <View className='score-box'>
                <Text className='score-text'>{hotexportdata.overall}</Text>
              </View>
            </View>
            <View className='header-right'>
              <Text className='score-title'>{hotexportdata.scoreTitle}</Text>
              {hotexportdata.subScores?.map((item, index) => (
                <Text className='sub-score-item' key={index}>{item}</Text>
              ))}
            </View>
          </View>
          {/* 标签区域 */}
          <View className='comment-tags'>
            {hotexportdata.commentTagVo?.map((item, index) => (
              <View className='tag-item' key={index}>
                <Text className='tag-text'>{item.text}</Text>
              </View>
            ))}
          </View>
          {/* 评论内容 */}
          {hotexportdata.comment && (
            <View className='comment-content'>
              <View className='user-info'>
                <Image 
                  src={hotexportdata.comment.userAvatars} 
                  className='user-avatar'
                  mode='aspectFill'
                />
                <View className='user-meta'>
                  <Text className='user-name'>{hotexportdata.comment.userName}</Text>
                  <Text className='check-date'>{hotexportdata.comment.checkInDate}</Text>
                </View>
              </View>
              <Text className='comment-text'>{hotexportdata.comment.commentDetail}</Text>
            </View>
          )}
        </View>
      </DetailSlot>
    </View>
  );
};