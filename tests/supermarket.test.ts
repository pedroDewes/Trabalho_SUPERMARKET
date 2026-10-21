import { Admin } from "../src/models/admin";
import { Supervisor } from "../src/models/supervisor";
import { Armazenamento } from "../src/services/armazenamento";
import { EmployeeService } from "../src/services/employeeService";


  test("Executar o cadastro de supervisor", () => {
    // Arrange
    const storage = new Armazenamento();
    const service = new EmployeeService(storage);
    const admin = new Admin(1, "System Admin", "admin@gmail.com");

    // Act
    const supervisor = service.registerUser(
      admin,
      "SUPERVISOR",
      2,
      "Joao Silva",
      "joao@supermarket.com"
    );

    // Assert
    expect(supervisor).toBeInstanceOf(Supervisor);
    expect(supervisor.getId()).toBe(2);
    expect(supervisor.getName()).toBe("Joao Silva");
    expect(supervisor.getEmail()).toBe("joao@supermarket.com");
    expect(supervisor.getRole()).toBe("SUPERVISOR");
    expect(service.listUsers(admin)).toContain(supervisor);
  });

  
test("deve rejeitar objeto que não seja um usuário válido", () => {
    // Arrange
    const storage = new Armazenamento();
    const service = new EmployeeService(storage);
    const usuarioInvalido = {} as Admin;

    // Act e Assert
    expect(() => service.registerUser(
        usuarioInvalido,
        "SUPERVISOR",
        2,
        "Joao Silva",
        "joao@supermarket.com"
    )).toThrow("Permission denied. Admin access is required.");
});



test("Deve rejeitar remoção por supervisor", () => {
    // Arrange
    const storage = new Armazenamento();
    const service = new EmployeeService(storage);
    const supervisor = new Supervisor(2, "Joao Silva", "joao@supermarket.com");

    // Act e Assert
    expect(() => service.removeUser(supervisor, 1))
        .toThrow("Permission denied. Admin access is required.");
});



test("deve remover usuário existente", () => {
    // Arrange
    const storage = new Armazenamento();
    const service = new EmployeeService(storage);
    const admin = new Admin(1, "System Admin", "admin@supermarket.com");

    service.registerUser(
        admin,
        "SUPERVISOR",
        2,
        "Joao Silva",
        "joao@supermarket.com"
    );

    // Act
    service.removeUser(admin, 2);

    // Assert
    expect(() => service.getUser(admin, 2))
        .toThrow();
});



test("deve rejeitar busca por ID inexistente", () => {
    // Arrange
    const storage = new Armazenamento();
    const service = new EmployeeService(storage);
    const admin = new Admin(1, "System Admin", "admin@supermarket.com");

    // Act e Assert
    expect(() => service.getUser(admin, 999))
        .toThrow(Error);
});

test("Pausar a execução após uma operação", () => {
    // Arrange
    const mensagem = "Press ENTER to continue...";

    // Act e Assert
    expect(mensagem).toBe("Press ENTER to continue...");
});

test("listar usuários com administrador", () => {
    // Arrange
    const storage = new Armazenamento();
    const service = new EmployeeService(storage);
    const admin = new Admin(1, "Admin", "admin@email.com");
    storage.addUser(admin);

    // Act
    const usuarios = service.listUsers(admin);

    // Assert
    expect(usuarios).toContain(admin);
});

test("Criar supervisor com dados válidos", () => {
    // Arrange
    const supervisor = new Supervisor(
        2, "Joao Silva", "joao@email.com"
    );

    // Act e Assert
    expect(supervisor.getRole()).toBe("SUPERVISOR");
});

test("Criar usuário com dados válidos", () => {
    // Arrange
    const admin = new Admin(1, "Admin", "admin@email.com");

    // Act e Assert
    expect(admin.getId()).toBe(1);
});

test("rejeitar cadastro com ID duplicado", () => {
    // Arrange
    const storage = new Armazenamento();
    const admin = new Admin(1, "Admin", "admin@email.com");
    storage.addUser(admin);

    // Act e Assert
    expect(() => {
        storage.addUser(
            new Admin(1, "Joao Silva", "joao@email.com")
        );
    }).toThrow("A user with this ID already exists.");
});

test("CT36 - Buscar usuário por ID válido", () => {
    // Arrange
    const storage = new Armazenamento();
    const admin = new Admin(1, "Admin", "admin@email.com");
    storage.addUser(admin);

    // Act
    const usuario = storage.findUserById(1);

    // Assert
    expect(usuario).toBe(admin);
});

test("CT42  Listar todos os usuários", () => {
    // Arrange
    const storage = new Armazenamento();
    const admin = new Admin(1, "Admin", "admin@email.com");
    storage.addUser(admin);

    // Act
    const usuarios = storage.getAllUsers();

    // Assert
    expect(usuarios).toContain(admin);
});

