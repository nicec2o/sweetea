/**
 * 파일 시스템 기반 데이터 관리 유틸리티
 * 
 * @description MySQL 대신 JSON 파일로 데이터를 관리하는 유틸리티
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// 데이터 디렉토리가 없으면 생성
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('Created data directory:', DATA_DIR);
  }
};

ensureDataDir().catch(console.error);

/**
 * JSON 파일 읽기
 * @param {string} filename - 파일명 (예: 'products.json')
 * @returns {Promise<Array>} JSON 데이터 배열
 */
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    console.log(`Reading file: ${filePath}`);
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    console.log(`Successfully read ${filename}: ${parsed.length} items`);
    return parsed;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    // 파일이 없으면 빈 배열 반환
    if (error.code === 'ENOENT') {
      console.log(`File ${filename} not found, returning empty array`);
      return [];
    }
    throw error;
  }
}

/**
 * JSON 파일 쓰기
 * @param {string} filename - 파일명
 * @param {Array} data - 저장할 데이터 배열
 * @returns {Promise<void>}
 */
async function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * 다음 ID 생성
 * @param {Array} items - 데이터 배열
 * @returns {number} 새로운 ID
 */
function getNextId(items) {
  if (items.length === 0) return 1;
  const maxId = Math.max(...items.map(item => item.id || 0));
  return maxId + 1;
}

/**
 * 상품 관련 함수들
 */
const products = {
  // 전체 상품 조회
  async getAll() {
    return await readJsonFile('products.json');
  },

  // ID로 상품 조회
  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === parseInt(id));
  },

  // 카테고리로 상품 조회
  async getByCategory(category) {
    const items = await this.getAll();
    return items.filter(item => item.category === category);
  },

  // 상품 검색
  async search(keyword) {
    const items = await this.getAll();
    const searchTerm = keyword.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      (item.name_en && item.name_en.toLowerCase().includes(searchTerm)) ||
      (item.name_ja && item.name_ja.toLowerCase().includes(searchTerm)) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );
  },

  // 상품 생성
  async create(productData) {
    const items = await this.getAll();
    const newProduct = {
      id: getNextId(items),
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    items.push(newProduct);
    await writeJsonFile('products.json', items);
    return newProduct;
  },

  // 상품 수정
  async update(id, productData) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    items[index] = {
      ...items[index],
      ...productData,
      id: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    await writeJsonFile('products.json', items);
    return items[index];
  },

  // 상품 삭제
  async delete(id) {
    const items = await this.getAll();
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    
    if (items.length === filteredItems.length) {
      throw new Error('Product not found');
    }
    
    await writeJsonFile('products.json', filteredItems);
    return true;
  }
};

/**
 * 주문 관련 함수들
 */
const orders = {
  // 전체 주문 조회
  async getAll() {
    return await readJsonFile('orders.json');
  },

  // ID로 주문 조회
  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === parseInt(id));
  },

  // 주문 생성
  async create(orderData) {
    const items = await this.getAll();
    const newOrder = {
      id: getNextId(items),
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    items.push(newOrder);
    await writeJsonFile('orders.json', items);
    return newOrder;
  },

  // 주문 수정
  async update(id, orderData) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Order not found');
    }

    items[index] = {
      ...items[index],
      ...orderData,
      id: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    await writeJsonFile('orders.json', items);
    return items[index];
  },

  // 주문 삭제
  async delete(id) {
    const items = await this.getAll();
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    
    if (items.length === filteredItems.length) {
      throw new Error('Order not found');
    }
    
    await writeJsonFile('orders.json', filteredItems);
    return true;
  },

  // 주문 통계
  async getStats() {
    const items = await this.getAll();
    const today = new Date().toISOString().split('T')[0];
    
    return {
      total: items.length,
      pending: items.filter(o => o.status === 'PENDING').length,
      completed: items.filter(o => o.status === 'COMPLETED').length,
      todayOrders: items.filter(o => o.created_at.startsWith(today)).length,
      totalRevenue: items
        .filter(o => o.status === 'COMPLETED')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0)
    };
  }
};

/**
 * 사용자 관련 함수들
 */
const users = {
  // 전체 사용자 조회
  async getAll() {
    return await readJsonFile('users.json');
  },

  // ID로 사용자 조회
  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === parseInt(id));
  },

  // 이메일로 사용자 조회
  async getByEmail(email) {
    const items = await this.getAll();
    return items.find(item => item.email === email);
  },

  // 사용자 생성
  async create(userData) {
    const items = await this.getAll();
    const newUser = {
      id: getNextId(items),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    items.push(newUser);
    await writeJsonFile('users.json', items);
    return newUser;
  },

  // 사용자 수정
  async update(id, userData) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('User not found');
    }

    items[index] = {
      ...items[index],
      ...userData,
      id: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    await writeJsonFile('users.json', items);
    return items[index];
  },

  // 사용자 삭제
  async delete(id) {
    const items = await this.getAll();
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    
    if (items.length === filteredItems.length) {
      throw new Error('User not found');
    }
    
    await writeJsonFile('users.json', filteredItems);
    return true;
  }
};

/**
 * 공통코드 관련 함수들
 */
const commonCodes = {
  // 전체 공통코드 조회
  async getAll() {
    return await readJsonFile('commonCodes.json');
  },

  // 그룹별 공통코드 조회
  async getByGroup(groupCode) {
    const items = await this.getAll();
    return items.filter(item => item.group_code === groupCode);
  },

  // 공통코드 생성
  async create(codeData) {
    const items = await this.getAll();
    const newCode = {
      id: getNextId(items),
      ...codeData,
      created_at: new Date().toISOString()
    };
    items.push(newCode);
    await writeJsonFile('commonCodes.json', items);
    return newCode;
  },

  // 공통코드 수정
  async update(id, codeData) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Common code not found');
    }

    items[index] = {
      ...items[index],
      ...codeData,
      id: parseInt(id)
    };
    
    await writeJsonFile('commonCodes.json', items);
    return items[index];
  },

  // 공통코드 삭제
  async delete(id) {
    const items = await this.getAll();
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    
    if (items.length === filteredItems.length) {
      throw new Error('Common code not found');
    }
    
    await writeJsonFile('commonCodes.json', filteredItems);
    return true;
  }
};

module.exports = {
  products,
  orders,
  users,
  commonCodes,
  readJsonFile,
  writeJsonFile
};
