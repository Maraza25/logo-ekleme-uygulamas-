import React, { useState, useRef } from 'react';

const App = () => {
  const [firstPhotos, setFirstPhotos] = useState([]);
  const [secondPhoto, setSecondPhoto] = useState(null);
  const [editedPhotos, setEditedPhotos] = useState([]);
  const canvasRef = useRef(null);

  const handleFirstPhotosChange = (event) => {
    const files = event.target.files;
    const newPhotos = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result);
        if (newPhotos.length === files.length) {
          setFirstPhotos(newPhotos);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleSecondPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSecondPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (firstPhotos.length === 0 || !secondPhoto) {
      alert('Lütfen her iki fotoğrafı da yükleyin!');
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let editedImages = [];

    for (let i = 0; i < firstPhotos.length; i++) {
   
      const img1 = new Image();
      img1.src = firstPhotos[i];
      img1.onload = () => {
        canvas.width = img1.width;
        canvas.height = img1.height;

        context.drawImage(img1, 0, 0);

        const img2 = new Image();
        img2.src = secondPhoto;
        img2.onload = () => {
          const x = canvas.width - img2.width - 10;
          const y = canvas.height - img2.height - 10;
          context.drawImage(img2, x, y);

          // Düzenlenmiş resmi oluştur
          const editedImage = canvas.toDataURL();
          editedImages.push(editedImage);
          console.log(editedImages);
        }

          // Tüm fotoğraflar düzenlendiyse
          if (editedImages.length === firstPhotos.length-1) {
            setEditedPhotos(editedImages);

            // Tüm fotoğrafları indir
            editedImages.forEach((image, index) => {
              const link = document.createElement('a');
              link.download = `edited-photo-${index + 1}.png`;
              link.href = image;
              link.click();
            });
          }
        };
      };
    
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h2>İlk Fotoğraflar</h2>
          <input type="file" accept="image/*" multiple onChange={handleFirstPhotosChange} />
          {firstPhotos.length > 0 &&
            firstPhotos.map((photo, index) => (
              <img key={index} src={photo} alt={`Fotoğraf ${index + 1}`} style={{ maxWidth: '300px', marginBottom: '10px' }} />
            ))}
        </div>
        <div>
          <h2>İkinci Fotoğraf</h2>
          <input type="file" accept="image/*" onChange={handleSecondPhotoChange} />
          {secondPhoto && <img src={secondPhoto} alt="İkinci Fotoğraf" style={{ maxWidth: '300px', marginTop: '10px' }} />}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleDownload}>Tüm Fotoğrafları Düzenle ve İndir</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default App;
