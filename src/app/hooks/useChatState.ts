import { useState } from 'react';
import {
  ButtonGroupType,
  MenuListType,
  MessageType,
  PaymentSelectorType,
} from '../types';

export function useChatState() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [buttonGroups, setButtonGroups] = useState<ButtonGroupType[]>([]);
  const [menuLists, setMenuLists] = useState<MenuListType[]>([]);
  const [paymentSelectors, setPaymentSelectors] = useState<PaymentSelectorType[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  function addMessage(type: 'bot' | 'user', content: string, imageUrl?: string) {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type, content, imageUrl,
      timestamp: getCurrentTime()
    }]);
  }

  function addImageMessage(imageUrl: string) {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'bot',
      content: '',
      imageUrl,
      timestamp: getCurrentTime()
    }]);
  }

  function addButtonGroup(buttons: Array<{ label: any; action: string; variant?: 'primary' | 'secondary' }>) {
    setButtonGroups(prev => [...prev, { id: Date.now().toString() + Math.random(), buttons }]);
  }

  function addMenuList(title: string | undefined, options: Array<{ id: string; label: string; action: string; description?: string }>) {
    setMenuLists(prev => [...prev, { id: Date.now().toString() + Math.random(), title, options }]);
  }

  function addPaymentSelector(showAutomatic: boolean, variant?: 'pay' | 'link' | 'autodebit') {
    setPaymentSelectors(prev => [...prev, { id: Date.now().toString() + Math.random(), showAutomatic, variant }]);
  }

  function clearInteractiveElements() {
    setButtonGroups([]);
    setMenuLists([]);
    setPaymentSelectors([]);
  }

  async function typeMessage(type: 'bot' | 'user', content: string, delay = 800) {
    if (type === 'bot') {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, delay));
      setIsTyping(false);
    }
    addMessage(type, content);
  }

  function resetChatState() {
    setMessages([]);
    setButtonGroups([]);
    setMenuLists([]);
    setPaymentSelectors([]);
    setIsTyping(false);
  }

  return {
    messages,
    buttonGroups,
    menuLists,
    paymentSelectors,
    isTyping,
    addMessage,
    addImageMessage,
    addButtonGroup,
    addMenuList,
    addPaymentSelector,
    clearInteractiveElements,
    typeMessage,
    resetChatState,
  };
}
