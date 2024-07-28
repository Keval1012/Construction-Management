import { FileJpgOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

const AttachmentCard = ({ attachmentList }) => {
  return (
    <div>
        <div className='d-flex-between'><h3>Attachments</h3><a>show all</a></div>
        <Divider />
        <div className='attachmentInsideDiv'>
            {attachmentList && attachmentList.length > 0 && attachmentList.map(o => {
                return (
                    <>
                        <div className='d-flex'>
                            <FileJpgOutlined className='attachmentIcon' />
                            <div className='attachmentContent'>
                                <div><b>{o?.attachment?.split('/')[o?.attachment?.split('/').length - 1]}</b></div>
                                <div>{dayjs(new Date(o?.createdAt)).format('DD/MM/YYYY')}</div>
                            </div>
                        </div>
                        <Divider className='attachmentDivider' />
                    </>
                )
            })}
            {attachmentList && attachmentList.length === 0 && <div>No attachments</div>}
        </div>
    </div>
  )
}

export default AttachmentCard;