-- Entity User series

CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    DateOfBirth DATE,
    Gender ENUM('Male', 'Female', 'Other'),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    UserAddress VARCHAR(500)
);

-- Entity Admin series

CREATE TABLE IF NOT EXISTS Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    PersonalRole VARCHAR(255),
    Department VARCHAR(255),
    LoginUsername VARCHAR(255),
    LoginPassword VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE IF NOT EXISTS NewsCategories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS News (
    NewsID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    ShortDescription TEXT,
    Content TEXT,
    ImageLink VARCHAR(255),
    CreatedBy INT,
    ModifiedBy INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CategoryID INT,
    FOREIGN KEY (CategoryID) REFERENCES NewsCategories(CategoryID),
    FOREIGN KEY (CreatedBy) REFERENCES User(UserID),
    FOREIGN KEY (ModifiedBy) REFERENCES User(UserID)
);

CREATE TABLE Newsletter (
    NewsletterID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    SubscribeAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Admin
ADD COLUMN LoginUsername VARCHAR(255);

ALTER TABLE Admin
ADD COLUMN LoginPassword VARCHAR(255);


INSERT INTO User (FullName, DateOfBirth, Gender, PhoneNumber, Email, UserAddress)
VALUES ('Anisphia Wyll Palettia', '2007', 'Female', '090786789', 'anisphia@magicology.com', '123 Mahou St, City, Palettia');


INSERT INTO Admin (UserID, PersonalRole, Department, LoginUsername, LoginPassword)
VALUES (
    (SELECT UserID FROM User WHERE FullName = 'Anisphia Wyll Palettia'),
    'Magicology Researcher',
    'Royal Magicology Lab',
    'mahou_anisphia',
    '$2a$10$MdOrjV5QMfEstmdunxW1rO1ye7QZgzVPtNdqzQOd42HGiEkDAgZke'
);

INSERT INTO NewsCategories (Name) VALUES ('Magicology');
INSERT INTO NewsCategories (Name) VALUES ('Politics');
INSERT INTO NewsCategories (Name) VALUES ('Entertainment');
INSERT INTO NewsCategories (Name) VALUES ('Sports');
INSERT INTO NewsCategories (Name) VALUES ('Health');
