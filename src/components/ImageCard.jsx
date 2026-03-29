function ImageCard({ image, title, subtitle }) {
  if (!image?.url) {
    return null
  }

  return (
    <article className="image-card">
      <img src={image.url} alt={image.alt || title} />
      <div className="image-card-copy">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </article>
  )
}

export default ImageCard
