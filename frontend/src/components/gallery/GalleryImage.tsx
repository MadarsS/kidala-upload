import { DocumentIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FileInterface } from '../../interfaces/file';
import { AppInfo, selectApp } from '../../redux/slices/appSlice';
import { BASE_URL } from '../../requests/routes';
import useWindowSize from '../hooks/useWindowSize';

const GalleryImage: React.FC<{ file: FileInterface; index: number }> = ({
    file,
    index,
}) => {
    const windowSize = useWindowSize();
    const router = useRouter();

    const appInfo: AppInfo = useSelector(selectApp);

    const [isLeft, setIsLeft] = useState(true);
    const [isTop, setIsTop] = useState(true);

    const checkPosition = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { width, height } = windowSize;

        if (width) {
            if (e.clientX > width / 2) {
                setIsLeft(false);
            }

            if (height && appInfo.files) {
                let imgIdx = index + 1;
                const fileLen = appInfo.files.length;

                const colSize5 = 640;
                const colSize7 = 768;
                const colSize10 = 1024;

                if(width >= colSize10){
                    imgIdx += 30;
                }else if(width >= colSize7){
                    imgIdx += 14;
                }else if(width >= colSize5){
                    imgIdx += 10;
                }

                if(imgIdx >= fileLen){
                    setIsTop(false);
                }
            }
        }
    };

    if (
        !file.name.includes('.png') &&
        !file.name.includes('.jpg') &&
        !file.name.includes('.gif') &&
        !file.name.includes('.jpeg') &&
        !file.name.includes('.svg') &&
        !file.name.includes('.jfif') &&
        !file.name.includes('.webp')
    ) {
        return (
            <div
                className="w-full h-full flex items-center justify-center group relative cursor-pointer"
                onClick={() => router.push(`/gallery/${file.hash}`)}
                onMouseOver={checkPosition}
            >
                <div className="w-[200px] h-[200px] max-w-full max-h-full relative flex flex-col items-center justify-center">
                    <DocumentIcon className="text-white h-16" />

                    <p className="text-white w-full truncate text-center">
                        {file.name}
                    </p>
                </div>

                <div
                    className={`absolute top-0 w-full h-full z-20 ${
                        isLeft ? 'left-0' : 'right-0'
                    }`}
                />
            </div>
        );
    }

    return (
        <div
            className="w-full h-full flex items-center justify-center group relative cursor-pointer"
            onClick={() => router.push(`/gallery/${file.hash}`)}
            onMouseOver={checkPosition}
        >
            <div className="w-[200px] h-[200px] max-w-full max-h-full relative">
                <Image
                    src={`${BASE_URL}/${file.hash}`}
                    alt={file.name}
                    draggable={false}
                    objectFit="cover"
                    layout="fill"
                />
            </div>

            <div
                className={`absolute top-0 w-full h-full z-20 ${
                    isLeft ? 'left-0' : 'right-0'
                }`}
            />

            <div
                className={`hidden sm:group-hover:flex absolute lg:w-[600px] z-10 ${
                    isLeft ? 'left-0 justify-start' : 'right-0 justify-end'
                } ${isTop ? 'top-0' : 'bottom-0'}`}
            >
                <div className="max-w-full max-h-full w-96 h-96 2xl:w-[600px] 2xl:h-[600px] relative ">
                    <Image
                        src={`${BASE_URL}/${file.hash}`}
                        alt={file.name}
                        draggable={false}
                        objectFit="cover"
                        layout="fill"
                    />
                </div>
            </div>
        </div>
    );
};

export default GalleryImage;
