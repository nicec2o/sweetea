/**
 * 파일 시스템 기반 데이터 관리 유틸리티 (Next.js용)
 */

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * JSON 파일 읽기
 */
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * JSON 파일 쓰기
 */
async function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * 다음 ID 생성
 */
function getNextId(items) {
  if (items.length === 0) return 1;
  const maxId = Math.max(...items.map(item => item.id || 0));
  return maxId + 1;
}

/**
 * 상품 관련 함수들
 */
export const products = {
  async getAll() {
    return await readJsonFile('products.json');
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === parseInt(id));
  },

  async getByCategory(category) {
    const items = await this.getAll();
    return items.filter(item => item.category === category);
  },

  async search(keyword) {
    const items = await this.getAll();
    const searchTerm = keyword.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      (item.name_en && item.name_en.toLowerCase().includes(searchTerm)) ||
      (item.name_ja && item.name_ja.toLowerCase().includes(searchTerm)) ||
      (item.name_vi && item.name_vi.toLowerCase().includes(searchTerm)) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );
  },

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
export const orders = {
  async getAll() {
    return await readJsonFile('orders.json');
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === parseInt(id));
  },

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

  async delete(id) {
    const items = await this.getAll();
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    
    if (items.length === filteredItems.length) {
      throw new Error('Order not found');
    }
    
    await writeJsonFile('orders.json', filteredItems);
    return true;
  }
};

/**
 * 사용자 관련 함수들
 */
export const users = {
  async getAll() {
    return await readJsonFile('users.json');
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === parseInt(id));
  },

  async getByEmail(email) {
    const items = await this.getAll();
    return items.find(item => item.email === email);
  },

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
export const commonCodes = {
  async getAll() {
    return await readJsonFile('commonCodes.json');
  },

  async getByGroup(groupCode) {
    const items = await this.getAll();
    return items.filter(item => item.group_code === groupCode);
  },

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

/**
 * 재료 관련 함수들
 */
export const ingredients = {
  async getAll() {
    return await readJsonFile('ingredients.json');
  },

  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === parseInt(id));
  },

  async getLowStock() {
    const items = await this.getAll();
    return items.filter(item => item.stock <= item.min_stock);
  },

  async create(ingredientData) {
    const items = await this.getAll();
    const newIngredient = {
      id: getNextId(items),
      ...ingredientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    items.push(newIngredient);
    await writeJsonFile('ingredients.json', items);
    return newIngredient;
  },

  async update(id, ingredientData) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Ingredient not found');
    }

    items[index] = {
      ...items[index],
      ...ingredientData,
      id: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    await writeJsonFile('ingredients.json', items);
    return items[index];
  },

  async delete(id) {
    const items = await this.getAll();
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    
    if (items.length === filteredItems.length) {
      throw new Error('Ingredient not found');
    }
    
    await writeJsonFile('ingredients.json', filteredItems);
    return true;
  },

  async updateStock(id, quantity) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Ingredient not found');
    }

    items[index].stock = parseInt(quantity);
    items[index].updated_at = new Date().toISOString();
    
    await writeJsonFile('ingredients.json', items);
    return items[index];
  }
};
