# Deploy en DonWeb VPS — informatenecochea.com

## 1. Conectarse al VPS

```bash
ssh root@IP_DEL_VPS
```

## 2. Instalar dependencias del servidor (una sola vez)

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# PM2
npm install -g pm2

# nginx
apt-get install -y nginx

# Verificar que MySQL esté instalado (DonWeb suele tenerlo preinstalado)
mysql --version
```

## 3. Crear la base de datos

```bash
mysql -u root -p
```

Dentro de MySQL:
```sql
CREATE DATABASE informate_necochea CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'informate_user'@'localhost' IDENTIFIED BY 'PASSWORD_SEGURA_AQUI';
GRANT ALL PRIVILEGES ON informate_necochea.* TO 'informate_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Crear carpetas del proyecto

```bash
mkdir -p /var/www/informatenecochea/backend
mkdir -p /var/www/informatenecochea/frontend
mkdir -p /var/www/informatenecochea/admin
```

## 5. Subir archivos (desde tu PC local, con FTP/SCP/FileZilla)

- `backend/` → `/var/www/informatenecochea/backend/` (todo excepto node_modules y .env)
- `frontend/` → `/var/www/informatenecochea/frontend/` (todo excepto node_modules)
- `admin/build/` → `/var/www/informatenecochea/admin/` (solo la carpeta build)
- `ecosystem.config.js` → `/var/www/informatenecochea/`

## 6. Instalar dependencias en el VPS

```bash
cd /var/www/informatenecochea/backend
npm install --omit=dev

cd /var/www/informatenecochea/frontend
npm install --omit=dev
```

## 7. Configurar el .env del backend

```bash
cp /var/www/informatenecochea/backend/.env.production /var/www/informatenecochea/backend/.env
nano /var/www/informatenecochea/backend/.env
```

Editá los campos:
- `DB_PASSWORD` → la contraseña que pusiste en el paso 3
- `JWT_SECRET` → una clave larga aleatoria (ej: generala en https://generate-secret.vercel.app/64)

## 8. Crear las tablas de la base de datos

```bash
cd /var/www/informatenecochea/backend
node setup-db.js
```

## 9. Configurar nginx

```bash
cp /ruta/nginx.conf /etc/nginx/sites-available/informatenecochea
ln -s /etc/nginx/sites-available/informatenecochea /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 10. Iniciar las apps con PM2

```bash
cd /var/www/informatenecochea
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 11. Instalar SSL (HTTPS gratuito con Let's Encrypt)

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d informatenecochea.com -d www.informatenecochea.com -d api.informatenecochea.com -d admin.informatenecochea.com
```

## 12. Verificar que todo funciona

- https://informatenecochea.com → frontend
- https://api.informatenecochea.com/health → debe responder `{"ok":true}`
- https://admin.informatenecochea.com → panel de administración

---

## Credenciales iniciales del admin

- Email: `admin@elnoDiario.com.ar`
- Contraseña: `Admin2026!`

**Cambiala inmediatamente después del primer login.**
