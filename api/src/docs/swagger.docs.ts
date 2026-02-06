/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         code:
 *           type: string
 *           example: "111.000"
 *         name:
 *           type: string
 *           example: "Kas & Bank"
 *         type:
 *           type: string
 *           enum: [ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE]
 *         level:
 *           type: integer
 *           example: 2
 *         balance:
 *           type: string
 *           example: "20000000"
 *         isSystem:
 *           type: boolean
 *         isControl:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         parentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AccountTreeNode:
 *       allOf:
 *         - $ref: '#/components/schemas/Account'
 *         - type: object
 *           properties:
 *             children:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AccountTreeNode'
 *
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     summary: Get all accounts with filtering
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by code or name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE]
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: Filter by parent ID (use "null" for root accounts)
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - type
 *             properties:
 *               code:
 *                 type: string
 *                 example: "111.003"
 *               name:
 *                 type: string
 *                 example: "Bank BRI"
 *               type:
 *                 type: string
 *                 enum: [ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE]
 *               parentId:
 *                 type: string
 *                 format: uuid
 *               balance:
 *                 type: number
 *                 example: 0
 *               isSystem:
 *                 type: boolean
 *                 default: false
 *               isControl:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       409:
 *         description: Account code already exists
 *
 * /api/v1/accounts/tree:
 *   get:
 *     summary: Get accounts as hierarchical tree
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE]
 *         description: Filter by account type
 *     responses:
 *       200:
 *         description: Account tree retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AccountTreeNode'
 *
 * /api/v1/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Account retrieved successfully
 *       404:
 *         description: Account not found
 *   put:
 *     summary: Update account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               balance:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       403:
 *         description: Cannot edit system/control account
 *       404:
 *         description: Account not found
 *   delete:
 *     summary: Delete account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Cannot delete account with children
 *       403:
 *         description: Cannot delete system/control account
 *       404:
 *         description: Account not found
 *
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               fullname:
 *                 type: string
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /api/v1/users/{id}/activate:
 *   patch:
 *     summary: Activate user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 * /api/v1/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

export {};
