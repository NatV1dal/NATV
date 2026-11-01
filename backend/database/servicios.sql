--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3 (Homebrew)
-- Dumped by pg_dump version 17.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: natalievidal
--

INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (1, 5, 'Sesión fotográfica personalizada', 'Una experiencia fotográfica creada especialmente para ti. Elegimos juntos el lugar, el estilo y los detalles para capturar momentos auténticos que reflejen tu esencia.', 'Planificación personalizada, sesión fotográfica, selección y edición de imágenes.', 40000.00, '/images/servicios/fotografia/fotografia-sesion-personalizada.webp', true, 'sesion-fotografica-personalizada', '["/images/servicios/fotografia/sesiones/sesion-01.webp", "/images/servicios/fotografia/sesiones/sesion-02.webp", "/images/servicios/fotografia/sesiones/sesion-03.webp", "/images/servicios/fotografia/sesiones/sesion-04.webp"]');
INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (2, 5, 'Retratos', 'Resaltamos tu personalidad a través de retratos profesionales, cuidando la iluminación, la composición y cada detalle. Ideales para perfiles profesionales, proyectos personales o recuerdos especiales.', 'Sesión de retratos, dirección fotográfica y edición de imágenes seleccionadas.', 40000.00, '/images/servicios/fotografia/fotografia-retratos.webp', true, 'retratos', '["/images/servicios/fotografia/retratos/retrato-01.webp", "/images/servicios/fotografia/retratos/retrato-02.webp", "/images/servicios/fotografia/retratos/retrato-03.webp"]');
INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (3, 5, 'Fotografía de matrimonios', 'Cada historia de amor merece ser recordada. Capturamos las emociones, los detalles y los momentos más especiales de tu matrimonio, creando recuerdos que podrás revivir una y otra vez.', 'Cobertura fotográfica del matrimonio, selección y edición de las mejores imágenes.', 350000.00, '/images/servicios/fotografia/fotografia-matrimonio.webp', true, 'fotografia-de-matrimonios', '["/images/servicios/fotografia/matrimonios/matrimonio-01.webp", "/images/servicios/fotografia/matrimonios/matrimonio-02.webp"]');
INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (4, 5, 'Fotografía de eventos', 'Capturamos los momentos que hacen único tu evento. Desde los pequeños detalles hasta sus protagonistas, creamos un registro visual profesional que refleja la esencia de cada celebración.', 'Cobertura fotográfica del evento, selección y edición de imágenes.', 150000.00, '/images/servicios/fotografia/fotografia-eventos.webp', true, 'fotografia-de-eventos', '["/images/servicios/fotografia/eventos/evento-01.webp", "/images/servicios/fotografia/eventos/evento-02.webp", "/images/servicios/fotografia/eventos/evento-03.webp"]');
INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (5, 5, 'Fotografía de mascotas', 'Porque ellos también son parte de nuestra historia. Capturamos la personalidad, las expresiones y los momentos más adorables de tu mascota, creando recuerdos tan especiales como el amor que les tienes.', 'Sesión fotográfica de mascotas, selección y edición de imágenes.', 50000.00, '/images/servicios/fotografia/fotografia-mascotas.webp', true, 'fotografia-de-mascotas', '["/images/servicios/fotografia/mascotas/mascota-01.webp", "/images/servicios/fotografia/mascotas/mascota-02.webp", "/images/servicios/fotografia/mascotas/mascota-03.webp", "/images/servicios/fotografia/mascotas/mascota-04.webp"]');
INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (6, 5, 'Fotografía Aérea', 'Descubre nuevas perspectivas desde las alturas. Capturamos imágenes aéreas que destacan espacios, propiedades y proyectos desde ángulos únicos, aportando una mirada diferente y profesional.', 'Captura de fotografías aéreas, selección y edición de imágenes en alta resolución.', 80000.00, '/images/servicios/fotografia/fotografia-aerea.webp', true, 'fotografia-aerea', '["/images/servicios/fotografia/aereas/aerea-01.webp", "/images/servicios/fotografia/aereas/aerea-02.webp", "/images/servicios/fotografia/aereas/aerea-03.webp"]');
INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (7, 5, 'Fotografía de fauna y naturaleza', 'Exploramos la belleza del mundo natural a través de imágenes que capturan la esencia de la vida silvestre, los paisajes y sus pequeños detalles. Cada fotografía busca transmitir la conexión y diversidad de nuestro entorno.', 'Registro fotográfico de fauna, flora y paisajes naturales, selección y edición de imágenes.', 100000.00, '/images/servicios/fotografia/fotografia-fauna-naturaleza.webp', true, 'fotografia-de-fauna-y-naturaleza', '["/images/servicios/fotografia/fauna-naturaleza/fauna-01.webp", "/images/servicios/fotografia/fauna-naturaleza/fauna-02.webp", "/images/servicios/fotografia/fauna-naturaleza/fauna-03.webp", "/images/servicios/fotografia/fauna-naturaleza/fauna-04.webp"]');
INSERT INTO public.servicios (id_servicio, id_categoria, nom_servicio, descrip_servicio, caracteristicas_serv, precio_refe, img_servicio, estado, slug, trabajos) OVERRIDING SYSTEM VALUE VALUES (8, 5, 'Fotografía de productos', 'Haz que tus productos destaquen desde la primera mirada. Creamos fotografías atractivas y profesionales que resaltan sus detalles, transmiten su esencia y potencian su presentación en tiendas online, catálogos y redes sociales.', 'Sesión fotográfica de productos, selección y edición de imágenes para uso comercial.', 30000.00, '/images/servicios/fotografia/fotografia-productos.webp', true, 'fotografia-de-productos', '["/images/servicios/fotografia/productos/producto-01.webp", "/images/servicios/fotografia/productos/producto-02.webp", "/images/servicios/fotografia/productos/producto-03.webp"]');


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE SET; Schema: public; Owner: natalievidal
--

SELECT pg_catalog.setval('public.servicios_id_servicio_seq', 8, true);


--
-- PostgreSQL database dump complete
--

