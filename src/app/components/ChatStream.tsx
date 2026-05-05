import { RefObject } from 'react';
import {
  ActiveSheet,
  ButtonGroupType,
  MenuListType,
  MessageType,
  PaymentSelectorType,
} from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatButtonGroup } from './ChatButtonGroup';
import { MenuList } from './MenuList';
import { PaymentSelector } from './PaymentSelector';
import { TypingIndicator } from './TypingIndicator';

type Props = {
  messages: MessageType[];
  buttonGroups: ButtonGroupType[];
  menuLists: MenuListType[];
  paymentSelectors: PaymentSelectorType[];
  isTyping: boolean;
  onAction: (action: string) => void;
  onPaymentSelect: (paymentId: string) => void;
  onOpenSheet: (config: NonNullable<ActiveSheet>) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

export function ChatStream({
  messages,
  buttonGroups,
  menuLists,
  paymentSelectors,
  isTyping,
  onAction,
  onPaymentSelect,
  onOpenSheet,
  messagesEndRef,
}: Props) {
  return (
    <>
      {messages.map(message =>
        message.imageUrl ? (
          <div
            key={message.id}
            className="flex justify-start mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="max-w-[85%] rounded-lg overflow-hidden shadow-sm bg-white">
              <img
                src={message.imageUrl}
                alt="Centro comercial"
                className="w-full h-72 object-cover"
              />
              {message.timestamp && (
                <div className="text-[11px] text-gray-400 px-2 py-1 text-right">
                  {message.timestamp}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ChatMessage
            key={message.id}
            type={message.type}
            content={message.content}
            timestamp={message.timestamp}
          />
        )
      )}

      {buttonGroups.map(group => (
        <ChatButtonGroup
          key={group.id}
          buttons={group.buttons.map(btn => ({
            ...btn,
            onClick: () => onAction(btn.action),
          }))}
        />
      ))}

      {menuLists.map(menu => (
        <MenuList
          key={menu.id}
          title={menu.title}
          options={menu.options}
          onOptionClick={onAction}
          onOpenSheet={onOpenSheet}
        />
      ))}

      {paymentSelectors.map(selector => (
        <PaymentSelector
          key={selector.id}
          showAutomatic={selector.showAutomatic}
          variant={selector.variant}
          onSelect={onPaymentSelect}
          onOpenSheet={onOpenSheet}
        />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </>
  );
}
