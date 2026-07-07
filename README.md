Diamond template should help get you started developing with Diamond in Vite.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
sudo yum install python3-pip -y

cd ~
python3 -m gdown "https://drive.google.com/uc?id=10eNuM9Xl4J_B4PYjBaUOD2m9fdMdkD34" -O archive.zip

unzip archive.zip -d temp_extract
sudo find temp_extract -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.bmp" -o -iname "*.tiff" \) -exec cp {} /mnt/efs/storage/app/public/itemImages \;
rm -rf temp_extract