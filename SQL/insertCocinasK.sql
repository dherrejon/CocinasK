use cocinasketapa1;


INSERT INTO Pais(Nombre)
			VALUES("México");

INSERT INTO Territorio(Nombre,Margen,Activo)
			VALUES("Bajio", 100.00, 0),
				  ("Norte", 150.00, 1);


INSERT INTO Plaza(UnidadNegocioId, TerritorioId, Estado, Municipio, Ciudad, Activo)
			VALUES(1, 1,"Guanajuato", "León", "León", 1),
				  (15, 1,"Guanajuato", "Irapuato", "Irapuato", 1),
				  (3, 1,"Guanajuato", "Salamanca", "Salamanca", 1),
				  (1, 2,"Sonora", "Hermosillo", "Hermosillo", 2),
				  (15, 2,"Sonora", "Guatabampo", "Guatabampo", 2),
				  (3, 2,"Sonora", "Cd. Obregón", "Cd. Obregón", 2);


INSERT INTO TipoUnidadNegocio( Nombre)
			VALUES ( "Punto de Venta");

INSERT INTO TipoUnidadNegocio( Nombre)
			VALUES ( "Fabrica");

INSERT INTO TipoUnidadNegocio( Nombre)
			VALUES ( "Oficina");

INSERT INTO Empresa( Nombre, Activo, PaisId, RFC, email, Domicilio, Estado, Municipio, Ciudad, Colonia, Codigo) 
			VALUES( "QUIDI cocinas S.A. de C.V.", 1, 1, "QCO-COCK112211", "cocinask@cocinask.com", "obregon 120", "Sonora", "Ciudad Obregón", "Ciudad Obregón", "centro", "56000");

INSERT INTO Perfil(Nombre) 
			VALUES("Administrador"), ("Ejecutivo"), ("Operativo");


INSERT INTO UnidadNegocio(  EmpresaId, TipoUnidadNegocioId, Nombre, Telefono, Colonia, Estado, Ciudad, Domicilio, Codigo, Activo, Municipio, PaisId) 
						Values(  1, 1, "Hermosillo", "462-107-76-54", "San Roque", "Sonora", "Hermosillo", "Centro 120", "23000", 1, "Hermosillo",1);

INSERT INTO Colaborador( UnidadNegocioId, Nombre, PrimerApellido, SegundoApellido, Domicilio, Estado, Ciudad, Codigo, Colonia, Activo, Municipio, PaisId)
				Values( 1, "Gabriel Eduardo", "Rivero", "Hernández", "Guatemala 293", "Guanajuato", "Leon","36223", "Morelos", 1, "León", 1); 

INSERT INTO Colaborador( UnidadNegocioId, Nombre, PrimerApellido, SegundoApellido, Domicilio, Estado, Ciudad, Codigo, Colonia, Activo, Municipio, PaisId)
				Values( 1, "Mario", "Quijada", "Mendivil", "Roma #103", "Sonora", "Guatabampo","78800", "San Pedro", 0, "Guatabampo", 1);

INSERT INTO Usuario( ColaboradorId, Nombre, Password, Activo) 
			VALUES( 1, "gabrielriv", "123", 1);

UPDATE UnidadNegocio SET ColaboradorId = 1 WHERE UnidadNegocioId = 1;


INSERT INTO PerfilPorUsuario(UsuarioId, PerfilId)
			VALUES (1,1), (1,2), (1,3);



INSERT INTO Colaborador( UnidadNegocioId, Nombre, PrimerApellido, SegundoApellido, Domicilio, Estado, Ciudad, Codigo, Colonia, Activo, Municipio, PaisId)
				Values( 1, "Carlos Horacio", "Quijada", "Díaz", "San Roque 134", "Sonora", "Cd. Obregón","73900", "Centro", 1, "Cd. Obregón", 1); 

INSERT INTO Usuario( ColaboradorId, Nombre, Password, Activo) 
			VALUES( 1, "carlitos", "123", 1);


INSERT INTO PerfilPorUsuario(UsuarioId, PerfilId)
			VALUES (2,1);


INSERT INTO ModuloGUI(Nombre)
			VALUES("Cocinas K"), ("Configuración"), ("Catálogos");

INSERT INTO Permiso(PerfilId, ModuloGUIId, Seccion, Operacion, Clave)
			VALUES (1, 1, "Unidades de Negocio", "Agregar", "AdmUNeAgregar"),
				   (1, 1, "Unidades de Negocio", "Consultar", "AdmUNeConsultar"),
				   (1, 1, "Unidades de Negocio", "Editar", "AdmUNeEditar"),
				   (1, 1, "Unidades de Negocio", "Activar-Desactivar", "AdmUNeActivar"),

				   (1, 1, "Plaza", "Agregar", "AdmPlaAgregar"),
				   (1, 1, "Plaza", "Consultar", "AdmPlaConsultar"),
				   (1, 1, "Plaza", "Editar", "AdmPlaEditar"),

				   (1, 1, "Plaza", "Activar-Desactivar", "AdmPlaActivar"),

				   (1, 1, "Territorio", "Agregar", "AdmTerAgregar"),
				   (1, 1, "Territorio", "Consultar", "AdmTerConsultar"),
				   (1, 1, "Territorio", "Editar", "AdmTerEditar"),
				   (1, 1, "Territorio", "Activar-Desactivar", "AdmTerActivar"),

				   (1, 1, "Colaborador", "Agregar", "AdmColAgregar"),
				   (1, 1, "Colaborador", "Consultar", "AdmColConsultar"),
				   (1, 1, "Colaborador", "Editar", "AdmColEditar"),
				   (1, 1, "Colaborador", "Activar-Desactivar", "AdmColActivar"),

				   (1, 1, "Usuario", "Agregar", "AdmUsuAgregar"),
				   (1, 1, "Usuario", "Ver Perfil", "AdmUsuPerfil"),
				   (1, 1, "Usuario", "Editar", "AdmUsuEditar"),
				   (1, 1, "Usuario", "Activar-Desactivar", "AdmUsuActivar"),
				   (1, 1, "Usuario", "Ver Permisos", "AdmUsuPermisos"),
				   (1, 1, "Usuario", "Restaurar Contaseña", "AdmUsuRestaurarPassword"),


				   (1, 2, "Empresa", "Agregar", "AdmEmpAgregar"),
				   (1, 2, "Empresa", "Consultar", "AdmEmpConsultar"),
				   (1, 2, "Empresa", "Editar", "AdmEmpEditar"),
				   (1, 2, 'Empresa', 'Activar-Desactivar', 'AdmEmpActivar'),

				   (1, 2, "Tipo de Unidad Negocio", "Agregar", "AdmTUNAgregar"),
				   (1, 2, "Tipo de Unidad Negocio", "Consultar", "AdmTUNConsultar"),
				   (1, 2, "Tipo de Unidad Negocio", "Editar", "AdmTUNEditar"),
				   (1, 2, "Tipo de Unidad Negocio", "Activar-Desactivar", "AdmTUNActivar"),

				   (2, 1, "Unidades de Negocio", "Agregar", "EjeUNeAgregar"),
				   (3, 1, "Unidades de Negocio", "Consultar", "OpeUNeConsultar"),

				   (1, 2, "Material", "Configurar", "ConMatConfigurar"),
					
				   (1, 3, "Combinación de Materiales", "Consultar", "AdmComConsultar");

INSERT INTO PermisoPorUsuario(UsuarioId, PermisoId)
			VALUES(1,1), (1,2), (1,3), (1,4), (1,5), (2,1), (2,3);

INSERT INTO UnidadNegocio(  ColaboradorId, EmpresaId, TipoUnidadNegocioId, Nombre, Telefono, Colonia, Estado, Ciudad, Domicilio, Codigo, Activo, Municipio, PaisId) 
						Values(  2, 1, 1, "Los Mochis", "477-893-00-11", "San Isidro", "Sinaloa", "Los Mochis", "Panáma 982", "73200", 0, "Los Mochis",1);


Insert INTO MedioContacto (Nombre) VALUES
						  ('Correo Electrónico'), ('Teléfono'), ('Dirección');

Insert INTO TipoMedioContacto (MedioContactoId, Nombre, Activo) VALUES
						  (1, "Trabajo", 1),(1, "Personal", 1),
							(2, "Casa", 1),	(2, "Trabajo", 0), (1, "Celular", 1),
							(3, "Presupuesto", 1),(3, "Actual", 1);

Insert INTO ContactoColaborador (TipoMedioContactoId, ColaboradorId, Contacto) VALUES
						  (1, 1, "gerh@laviria.org"), (2, 1, "gabrielriv@gmail.com"), (3, 1, "4621077688"),
						  (2, 2, "carlos@gmail.org"), (3, 2, "4881027699"), (4, 2, "4621077688"),
							(1, 3, "mario@gmail.org"), (5, 3, "4011077688");

DROP VIEW IF EXISTS UsuarioCompleto;
CREATE VIEW UsuarioCompleto AS
SELECT pe.PermisoId, m.Nombre as Modulo, pe.Seccion, pe.Operacion, pe.Clave, p.Nombre as NombrePerfil, p.PerfilId, U.Nombre as NombreUsuario, U.UsuarioId, U.Password, U.Activo, c.Nombre as NombreColaborador
FROM Perfil p,  Usuario U, PerfilPorUsuario pu, Permiso pe, PermisoPorUsuario peu, ModuloGUI m, Colaborador c
where  pu.UsuarioId = u.UsuarioId AND pu.PerfilId = p.PerfilId 
		AND peu.PermisoId = pe.PermisoId AND peu.UsuarioId = u.UsuarioId
		AND pe.ModuloGUIId = m.ModuloGUIId AND pe.PerfilId = p.PerfilId
		AND c.ColaboradorId = U.ColaboradorId;

DROP VIEW IF EXISTS VistaUnidadNegocio;
CREATE VIEW VistaUnidadNegocio AS
SELECT un.*, e.Nombre as NombreEmpresa, p.Nombre as NombrePais, CONCAT(c.Nombre, ' ', c.PrimerApellido, ' ', c.SegundoApellido) as colaborador, tun.Nombre as NombreTipoUnidadNegocio 
FROM UnidadNegocio un, Empresa e, Pais p, Colaborador c, TipoUnidadNegocio tun  
WHERE un.EmpresaId = e.EmpresaId AND p.PaisId =  un.EmpresaId AND c.ColaboradorId = un.ColaboradorId AND tun.TipoUnidadNegocioId = un.TipoUnidadNegocioId;

DROP VIEW IF EXISTS PlazaVista;
CREATE VIEW PlazaVista AS
SELECT p.*, t.Nombre as NombreTerritorio, u.Nombre as NombreUnidadNegocio, t.Margen, tu.TipoUnidadNegocioId, tu.Nombre as NombreTipoUnidadNegocio
FROM Plaza p, Territorio t, UnidadNegocio u, TipoUnidadNegocio tu
where  p.TerritorioId = t.TerritorioId AND p.UnidadNegocioId = u.UnidadNegocioId AND tu.TipoUnidadNegocioId = u.TipoUnidadNegocioId;

DROP VIEW IF EXISTS ColaboradorVista;
CREATE VIEW ColaboradorVista AS
SELECT c.*, p.Nombre as NombrePais, u.Nombre as NombreUnidadNegocio, tu.Nombre as NombreTipoUnidadNegocio, user.Nombre as NombreUsuario, user.UsuarioId, user.Activo as ActivoUsuario
FROM  UnidadNegocio u, Pais p, TipoUnidadNegocio tu, Colaborador c
LEFT JOIN usuario user ON user.ColaboradorId = c.ColaboradorId
where c.PaisId = p.PaisId AND c.UnidadNegocioId = u.UnidadNegocioId AND u.TipoUnidadNegocioId = tu.TipoUnidadNegocioId;

DROP VIEW IF EXISTS ContactoColaboradorVista;
CREATE VIEW ContactoColaboradorVista AS
SELECT c.ColaboradorId, c.Contacto, tm.Nombre as NombreTipoMedioContacto, m.Nombre as NombreMedioContacto
FROM  ContactoColaborador c, TipoMedioContacto tm, MedioContacto m
WHERE c.TipoMedioContactoId = tm.TipoMedioContactoId AND tm.MedioContactoId = m.MedioContactoId;

DROP VIEW IF EXISTS TipoMedioContactoVista;
CREATE VIEW TipoMedioContactoVista AS
SELECT  m.Nombre as NombreMedioContacto, t.*
FROM  MedioContacto m, TipoMedioContacto t
WHERE m.MedioContactoId = t.MedioContactoId;


DROP VIEW IF EXISTS PermisoVista;
CREATE VIEW PermisoVista AS
SELECT p.*, m.Nombre as NombreModulo, pf.Nombre as NombrePerfil
FROM  Permiso p, ModuloGUI m, Perfil pf
WHERE p.ModuloGUIId = m.ModuloGUIId AND p.PerfilId = pf.PerfilId;
		