class PharmacyService {
  constructor(pharmacyRepository) {
    this.pharmacyRepository = pharmacyRepository;
  }

  async getAllMedicines(page = 1, limit = 20) {
    return await this.pharmacyRepository.getAll(page, limit, { status: 'active' });
  }

  async getMedicineById(medicineId) {
    const medicine = await this.pharmacyRepository.getById(medicineId);
    if (!medicine) {
      throw new Error('Medicine not found');
    }
    return medicine;
  }

  async searchMedicines(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 1) {
      throw new Error('Search term cannot be empty');
    }
    return await this.pharmacyRepository.searchMedicines(searchTerm);
  }

  async updateStock(medicineId, quantity) {
    const medicine = await this.getMedicineById(medicineId);

    if (medicine.quantity_in_stock + quantity < 0) {
      throw new Error('❌ Insufficient stock');
    }

    return await this.pharmacyRepository.updateStock(medicineId, quantity);
  }

  async getLowStockAlert() {
    return await this.pharmacyRepository.getLowStockMedicines();
  }

  async getExpiredMedicines() {
    return await this.pharmacyRepository.getExpiredMedicines();
  }
}

module.exports = PharmacyService;
