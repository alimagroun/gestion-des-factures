package com.magroun.gestiondesfactures.service;

import java.util.List;

import com.magroun.gestiondesfactures.model.LineItem;

public interface LineItemService {
    LineItem createLineItem(LineItem lineItem);
    List<LineItem> getAllLineItems();
    LineItem getLineItemById(Long id);
    void deleteLineItem(Long id);

}
