import { useState, useEffect, useCallback } from 'react';
import './PostMediaGrid.css';

const PostMediaGrid = ({ files }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const count = files?.length || 0;

    const isVideo = (path) => {
        if (!path) return false;
        return typeof path === 'string' && path.match(/\.(mp4|webm|ogg|quicktime)$/i);
    };

    const closeLightbox = useCallback(() => setActiveIndex(null), []);

    const handleMediaClick = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveIndex(index);
    };

    const goToNext = useCallback((e) => {
        if (e) e.stopPropagation();
        if (count > 0) {
            setActiveIndex((prev) => (prev + 1) % count);
        }
    }, [count]);

    const goToPrev = useCallback((e) => {
        if (e) e.stopPropagation();
        if (count > 0) {
            setActiveIndex((prev) => (prev - 1 + count) % count);
        }
    }, [count]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeIndex === null) return;
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, goToNext, goToPrev, closeLightbox]);

    if (!files || files.length === 0) return null;

    const displayFiles = files.slice(0, 4); // Grid shows max 4 containers
    const remainingCount = count - 4;

    const activeFile = activeIndex !== null ? (files[activeIndex]?.file_path || files[activeIndex]) : null;

    return (
        <>
            <div className="fb-post-media">
                <div className={`fb-media-grid fb-media-grid-${Math.min(count, 4)}`}>
                    {displayFiles.map((file, index) => {
                        const filePath = file.file_path || file;
                        return (
                            <div
                                key={index}
                                className="fb-media-item"
                                onClick={(e) => handleMediaClick(e, index)}
                                style={{ cursor: 'pointer' }}
                            >
                                {isVideo(filePath) ? (
                                    <video src={filePath} muted loop playsInline />
                                ) : (
                                    <img src={filePath} alt={`Post media ${index + 1}`} />
                                )}

                                {/* Overlay for 4+ items */}
                                {index === 3 && remainingCount > 0 && (
                                    <div className="fb-media-overlay">
                                        +{remainingCount}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox / Media Modal */}
            {activeIndex !== null && (
                <div className="fb-media-modal-overlay" onClick={closeLightbox}>
                    <button className="fb-media-modal-close" onClick={closeLightbox}>&times;</button>

                    {count > 1 && (
                        <>
                            <button className="fb-media-nav-btn fb-media-nav-prev" onClick={goToPrev}>
                                <i className="ti ti-chevron-left"></i>
                            </button>
                            <button className="fb-media-nav-btn fb-media-nav-next" onClick={goToNext}>
                                <i className="ti ti-chevron-right"></i>
                            </button>
                        </>
                    )}

                    <div className="fb-media-modal-content" onClick={(e) => e.stopPropagation()}>
                        {isVideo(activeFile) ? (
                            <video key={activeFile} src={activeFile} controls autoPlay />
                        ) : (
                            <img src={activeFile} alt="Preview" />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default PostMediaGrid;
