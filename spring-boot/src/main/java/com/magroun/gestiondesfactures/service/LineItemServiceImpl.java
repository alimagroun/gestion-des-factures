package com.magroun.gestiondesfactures.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.magroun.gestiondesfactures.model.LineItem;
import com.magroun.gestiondesfactures.repository.LineItemRepository;

import java.util.List;

@Service
public class LineItemServiceImpl implements LineItemService {

    private final LineItemRepository lineItemRepository;

    @Autowired
    public LineItemServiceImpl(LineItemRepository lineItemRepository) {
        this.lineItemRepository = lineItemRepository;
    }

    @Override
    public LineItem createLineItem(LineItem lineItem) {
        return lineItemRepository.save(lineItem);
    }

    @Override
    public List<LineItem> getAllLineItems() {
        return lineItemRepository.findAll();
    }

    @Override
    public LineItem getLineItemById(Long id) {
        return lineItemRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteLineItem(Long id) {
        lineItemRepository.deleteById(id);
    }

}

