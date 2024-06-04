import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { createUser } from "../../controllers/userController/CreateUse.Controller";
import { ValidateEmail } from "../../repository/userRepository/ValidateEmail.Repository";
import { Create } from "../../repository/userRepository/CreateUser.Repository";

// Configurar los mocks de ValidateEmail y Create
jest.mock('../../repository/userRepository/ValidateEmail.Repository');
jest.mock('../../repository/userRepository/CreateUser.Repository');

// Configurar el mock de bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword') // Mockear la función hash
}));

// Iniciar la descripción de las pruebas
describe('createUser', () => {
  // Definir las variables para la solicitud (req) y la respuesta (res)
  const req: Request = { body: { email_U: 'test@example.com', password_U: 'password', Name_U: 'Test User', Phone_Number: '123456789', Address: 'Test Address' } } as Request;
  const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

  // Limpiar los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Primera prueba: debería devolver 400 si el usuario ya existe
  it('should return 400 if user already exists', async () => {
    (ValidateEmail as jest.Mock).mockResolvedValue(true); // Simular que el usuario ya existe

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
  });

  // Segunda prueba: debería crear un nuevo usuario y devolver 200
  it('should create a new user and return 200', async () => {
    (ValidateEmail as jest.Mock).mockResolvedValue(false); // Simular que el usuario no existe

    await createUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10); // Verificar que bcrypt.hash fue llamado con la contraseña
    expect(Create).toHaveBeenCalledWith({
      email_U: 'test@example.com',
      password_U: expect.any(String), // Verificar que la contraseña hasheada fue pasada a la función Create
      Name_U: 'Test User',
      Phone_Number: '123456789',
      Address: 'Test Address'
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ menssage: 'Successfully created user' });
});

  // Tercera prueba: debería devolver 500 si ocurre un error
  it('should return 500 if an error occurs', async () => {
    (ValidateEmail as jest.Mock).mockRejectedValue(new Error('Internal server error')); // Simular un error interno

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server internal error' });
  });
});
