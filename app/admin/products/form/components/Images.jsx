

export default function Images({handleMultiplePicChange, handlePicChange, picURLs, featureImage}) {
  
  return (
    <section className="flex  flex-col gap-3 bg-white border p-4 rounded-xl ">
      <h1 className="font-semibold">Images</h1>
      <div className="flex flex-col gap-1">
        {featureImage &&(
            <div className="flex items-center justify-center">

            <img src={featureImage} className="h-12 object-cover" alt="featured-picture" />
            </div>
        ) 
    }
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-feature-image"
        >
          Feature Image <span className="text-red-500">*</span>
        </label>
        <input
      
          type="file"
          id="product-feature-image"
          onChange={handlePicChange}
          name="product-feature-image"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        {picURLs.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
                {picURLs.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    className="h-12 object-cover"
                    alt={`product-image-${index}`}
                />
                ))}
            </div>
        )}
        <label className="text-gray-500 text-xs" htmlFor="product-images">
          Images <span className="text-red-500">*</span>
        </label>
        <input
       
          type="file"
          multiple
          id="product-images"
          onChange={handleMultiplePicChange}
          name="product-images"
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
    </section>
  );
}
